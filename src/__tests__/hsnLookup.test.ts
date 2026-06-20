import { HSN_OPTIONS, searchHSN } from "@/components/HSNLookup";

describe("searchHSN", () => {
  it('returns the web development entry for search "web"', () => {
    expect(searchHSN("web")).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          code: "998313",
          label: "Web development",
        }),
      ]),
    );
  });

  it('returns the software development entry for search "998314"', () => {
    expect(searchHSN("998314")).toEqual([
      {
        code: "998314",
        label: "Software development",
      },
    ]);
  });

  it('returns an empty array for search "xyz123"', () => {
    expect(searchHSN("xyz123")).toEqual([]);
  });

  it("returns all 10 entries for an empty string search", () => {
    expect(searchHSN("")).toHaveLength(10);
    expect(searchHSN("")).toEqual(HSN_OPTIONS);
  });

  it("performs case-insensitive searches", () => {
    expect(searchHSN("WEB")).toEqual(searchHSN("web"));
  });
});
