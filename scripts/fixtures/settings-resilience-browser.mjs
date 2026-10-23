export default async function checkSettingsBrowser(page) {
  const origin = "__FIXTURE_ORIGIN__";
  const evidence = "__EVIDENCE_DIR__";
  const checks = [];
  const assert = (value, message) => {
    if (!value) throw new Error(message);
  };
  for (const width of [320, 768, 1440]) {
    for (const route of ["/contact", "/booking", "/booking?service=training"]) {
      const context = await page
        .context()
        .browser()
        .newContext({ viewport: { width, height: 1000 } });
      const tab = await context.newPage();
      const errors = [];
      const trackers = [];
      const submissions = [];
      tab.on("pageerror", (error) => errors.push(error.message));
      tab.on("console", (message) => {
        if (["error", "warning"].includes(message.type())) errors.push(message.text());
      });
      tab.on("request", (request) => {
        if (
          /googletagmanager|google-analytics|analytics.google|zalo.*sdk|connect.facebook/.test(
            request.url(),
          )
        )
          trackers.push(request.url());
      });
      await tab.route("**/api/leads", async (leadRoute) => {
        const lead = leadRoute.request().postDataJSON();
        assert(
          lead.kind === (route.startsWith("/contact") ? "contact" : "booking"),
          "submission kind must match route",
        );
        assert(lead.treatment === undefined, "unavailable context must omit treatment");
        submissions.push({ kind: lead.kind, treatmentAbsent: lead.treatment === undefined });
        await leadRoute.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({ success: true }),
        });
      });
      await tab.goto(origin + route);
      await tab.getByRole("button", { name: "Từ chối", exact: true }).waitFor();
      // Exercise the real skip-link keyboard path before rejecting consent.
      await tab.keyboard.press("Tab");
      assert(
        await tab.locator(".skip").evaluate((el) => document.activeElement === el),
        "skip link receives first focus",
      );
      await tab.keyboard.press("Enter");
      assert(tab.url().endsWith("#main"), "skip link targets main");
      await Promise.all([
        tab.waitForEvent("load"),
        tab.getByRole("button", { name: "Từ chối", exact: true }).click(),
      ]);
      await tab.reload();
      assert(
        (await tab.getByRole("button", { name: "Từ chối", exact: true }).count()) === 0,
        "consent rejection persists",
      );
      assert(
        (await tab.locator('a[href="tel:0828959598"]').count()) > 0,
        "approved phone remains available",
      );
      assert(
        (await tab.locator('a[href="mailto:Holisticrep9@gmail.com"]').count()) > 0,
        "approved email remains available",
      );
      assert(
        (await tab.locator('a[href="https://zalo.me/4411042584729737012"]').count()) > 0,
        "approved Zalo remains available",
      );
      assert(
        (await tab.locator("footer").getByText("Cơ sở Xóm Chiếu", { exact: true }).count()) === 1,
        "one confirmed clinic",
      );
      assert((await tab.locator("h1").count()) === 1, "one page heading");
      assert(
        await tab.evaluate(() => document.documentElement.scrollWidth <= innerWidth),
        `no overflow at ${width}`,
      );
      const tabTo = async (target) => {
        for (let attempt = 0; attempt < 100; attempt++) {
          if (await target.evaluate((el) => document.activeElement === el)) return;
          await tab.keyboard.press("Tab");
        }
        throw new Error("Control is not keyboard reachable");
      };
      await tabTo(tab.getByRole("textbox", { name: "Họ và tên", exact: true }));
      await tab.keyboard.type("Synthetic fixture");
      await tab.keyboard.press("Tab");
      assert(
        await tab
          .getByRole("textbox", { name: "Số điện thoại", exact: true })
          .evaluate((el) => document.activeElement === el),
        "phone follows name in Tab order",
      );
      await tab.keyboard.type("0901234567");
      await tabTo(tab.getByRole("button", { name: "Gửi yêu cầu" }));
      await tab.keyboard.press("Enter");
      await tab.locator('form[data-state="sent"]').waitFor();
      assert(submissions.length === 1, "one synthetic keyboard submission");
      for (const href of [
        "tel:0828959598",
        "mailto:Holisticrep9@gmail.com",
        "https://zalo.me/4411042584729737012",
      ]) {
        const link = tab.locator(`footer a[href="${href}"]`).first();
        await link.scrollIntoViewIfNeeded();
        assert(await link.isVisible(), "direct footer channel is visible");
        await tabTo(link);
        assert(
          await link.evaluate((el) => {
            const box = el.getBoundingClientRect();
            return box.top >= 0 && box.bottom <= innerHeight && document.activeElement === el;
          }),
          "direct channel is visible and keyboard reachable",
        );
      }
      assert(
        await tab.evaluate(() => !window.dataLayer?.length),
        "no analytics events after rejection",
      );
      assert(trackers.length === 0, "no tracking SDKs after rejection");
      assert(errors.length === 0, `clean browser console: ${errors.join("; ")}`);
      const name = `${route.startsWith("/contact") ? "contact" : route.includes("?") ? "booking-context-error" : "booking"}-${width}.png`;
      await tab.screenshot({ path: `${evidence}/${name}`, fullPage: true });
      checks.push({
        route,
        width,
        keyboard: true,
        consentRejected: true,
        noOverflow: true,
        directChannels: true,
        syntheticSubmission: submissions[0],
        consoleErrors: errors.length,
        trackingRequests: trackers.length,
        screenshot: name,
      });
      await context.close();
    }
  }
  return {
    generatedAt: new Date().toISOString(),
    boundaries: "Browser /api/leads is mocked. No delivery or inbox assertion.",
    checks,
  };
}
