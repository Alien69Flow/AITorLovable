/** A-Ads banner unit (crypto-native, no tracking cookies). */
export function AAdsBanner() {
  return (
    <div
      id="aads-frame"
      style={{ width: "100%", margin: "auto", position: "relative", zIndex: 99998 }}
    >
      <iframe
        title="A-Ads banner"
        data-aa="2453418"
        src="//acceptable.a-ads.com/2453418/?size=Adaptive"
        style={{
          border: 0,
          padding: 0,
          width: "70%",
          height: "auto",
          overflow: "hidden",
          display: "block",
          margin: "auto",
        }}
      />
    </div>
  );
}

export default AAdsBanner;
