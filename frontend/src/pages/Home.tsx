/* Field Ledger style: editorial cartography, mineral paper, vermilion signal marks, asymmetric map + ledger rail. */
import { useEffect, useMemo, useRef, useState } from "react";
import type { PointerEvent as ReactPointerEvent } from "react";
import ExactRegionMap from "@/components/ExactRegionMap";
import "leaflet/dist/leaflet.css";
import {   getAvailableStates, getEvidence, getGroundTruthSnapshot, getInfrastructureRecords, getRegionGeometries, predictFutureValue,
  type DbGeometryRegion, type EvidenceRecord, type InfrastructureRecord, type PredictionResult, type ProjectType, type Region }
  from "@/services/groundTruthService";
import {
  ArrowUpRight,
  Building2,
  ChevronRight,
  ExternalLink,
  Factory,
  FileText,
  Landmark,
  MapPin,
  Menu,
  Minus,
  Navigation,
  Newspaper,
  Search,
  ShieldCheck,
  TrainFront,
  X,
} from "lucide-react";

function formatINR(value: number) {
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(value);
}
function changeRange(region: Region) {
  if (!region.projected) return null;
  return [((region.projected[0] / region.value - 1) * 100), ((region.projected[1] / region.value - 1) * 100)] as [number, number];
}
function iconFor(type: ProjectType) {
  if (type === "Airport") return <Navigation size={15} />;
  if (type === "Road corridor") return <Navigation size={15} />;
  if (type === "Transit") return <TrainFront size={15} />;
  if (type === "Industrial") return <Factory size={15} />;
  return <Building2 size={15} />;
}
export default function Home() {
  const [regions, setRegions] = useState<Region[]>([]);
  const [geometries, setGeometries] = useState<DbGeometryRegion[]>([]);
  const [infrastructures, setInfrastructures] = useState<InfrastructureRecord[]>([]);
  const [evidence, setEvidence] = useState<EvidenceRecord[]>([]);

  const [officialValueUrl, setOfficialValueUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedId, setSelectedId] = useState("");
  const [states, setStates] = useState<string[]>([]);
  const [selectedState, setSelectedState] = useState("");
  const [propertyValue, setPropertyValue] = useState("");
  const [propertyType, setPropertyType] = useState("Plot");
  const [horizonMonths, setHorizonMonths] = useState(24);
  const [prediction, setPrediction] = useState<PredictionResult | null>(null);
  const [isPredicting, setIsPredicting] = useState(false);
  const [district, setDistrict] = useState("All districts");
  const [query, setQuery] = useState("");
  const [activeTypes, setActiveTypes] = useState<ProjectType[]>([]);
  const showProjects = true;
  const [activeTab, setActiveTab] = useState<"drivers" | "evidence">("drivers");
  const [mobilePanel, setMobilePanel] = useState(false);
  const [infoWidth, setInfoWidth] = useState(435);
  const draggingInfo = useRef(false);
  const [hasAcceptedNotice, setHasAcceptedNotice] = useState(() => sessionStorage.getItem("groundtruth-notice-accepted") === "1");
  const [noticeConfirmed, setNoticeConfirmed] = useState(false);

  useEffect(() => {
    let cancelled = false;
    getAvailableStates().then((availableStates) => {
      if (!cancelled) setStates(availableStates);
    }).catch(() => {
      if (!cancelled) setStates([]);
    });
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    if (!selectedState) {
      setRegions([]);
      setGeometries([]);
      setInfrastructures([]);
      setIsLoading(false);
      return;
    }
    let cancelled = false;
    setIsLoading(true);
    Promise.allSettled([getGroundTruthSnapshot(selectedState), getRegionGeometries(selectedState), getInfrastructureRecords(selectedState)]).then(([snapshotResult, geometryResult, infrastructureResult]) => {
      if (cancelled) return;
      if (snapshotResult.status === "fulfilled") {
        setRegions(snapshotResult.value.regions);
        setActiveTypes(snapshotResult.value.projectTypes);
        setOfficialValueUrl(snapshotResult.value.officialValueUrl);
      } else {
        setRegions([]);
        setActiveTypes([]);
        setOfficialValueUrl("https://bhubharati.telangana.gov.in/viewMarketValueLandStampDuty");
      }
      setGeometries(geometryResult.status === "fulfilled" ? geometryResult.value : []);
      setInfrastructures(infrastructureResult.status === "fulfilled" ? infrastructureResult.value : []);
      setIsLoading(false);
    });
    return () => { cancelled = true; };
  }, [selectedState]);

  const districts = useMemo(() => ["All districts", ...Array.from(new Set(regions.map((region) => region.district)))], [regions]);
  const filteredRegions = useMemo(() => regions.filter((r) => {
    const districtMatches = district === "All districts" || r.district === district;
    const queryMatches = !query || `${r.name} ${r.district} ${r.drivers.map((d) => d.name).join(" ")}`.toLowerCase().includes(query.toLowerCase());
    return districtMatches && queryMatches;
  }), [district, query, regions]);
  const selected = selectedId ? regions.find((r) => r.id === selectedId) : undefined;
  const range = selected ? changeRange(selected) : null;
  const selectedDrivers = selected?.drivers.filter((d) => activeTypes.includes(d.type)) ?? [];
  useEffect(() => {
    if (selected) {
      setPropertyValue(String(selected.value));
    } else {
      setPropertyValue("");
    }
    setPrediction(null);
  }, [selectedId, selected?.value]);

  useEffect(() => {
    if (!selectedId) { setEvidence([]); return; }
    getEvidence(selectedId).then(setEvidence).catch(() => setEvidence([]));
  }, [selectedId]);
  const detailOpen = Boolean(selected && mobilePanel);

  const selectState = (state: string) => { setSelectedState(state); setSelectedId(""); setPrediction(null); setDistrict("All districts"); setQuery(""); setMobilePanel(false); };
  const runPrediction = async () => { if (!selected || !propertyValue || Number(propertyValue) <= 0) return; setIsPredicting(true); const result = await predictFutureValue({ regionId: selected.id, currentValue: Number(propertyValue), propertyType, horizonMonths }); setPrediction(result); setIsPredicting(false); };
  const acceptNotice = () => { sessionStorage.setItem("groundtruth-notice-accepted", "1"); setHasAcceptedNotice(true); };
  useEffect(() => {
    const onPointerMove = (event: PointerEvent) => {
      if (!draggingInfo.current || window.innerWidth <= 820) return;
      const nextWidth = window.innerWidth - event.clientX;
      setInfoWidth(Math.min(window.innerWidth * 0.5, Math.max(320, nextWidth)));
    };
    const onPointerUp = () => { draggingInfo.current = false; document.body.style.cursor = ""; document.body.style.userSelect = ""; };
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);
    return () => { window.removeEventListener("pointermove", onPointerMove); window.removeEventListener("pointerup", onPointerUp); };
  }, []);
  const startInfoResize = (event: ReactPointerEvent<HTMLDivElement>) => { if (window.innerWidth <= 820) return; draggingInfo.current = true; event.currentTarget.setPointerCapture?.(event.pointerId); document.body.style.cursor = "col-resize"; document.body.style.userSelect = "none"; };

  if (!hasAcceptedNotice) return <main className="notice-screen"><section className="notice-card"><div className="notice-mark"><ShieldCheck size={24} /></div><div className="eyebrow"><span className="eyebrow-line" /> BEFORE YOU ENTER</div><h1>Read the ground<br /><em>with care.</em></h1><p className="notice-lead">Ground Truth is an exploratory property-intelligence tool. It translates public infrastructure signals and regional context into an estimated future-price range.</p><div className="notice-points"><div><strong>Estimates, not promises</strong><span>Predictions may vary materially from actual market prices, timelines, or outcomes.</span></div><div><strong>Verify before acting</strong><span>Check the official government value and consult a licensed valuer or financial professional.</span></div><div><strong>Use at your own risk</strong><span>Ground Truth and its contributors are not responsible for financial loss, missed opportunity, or any decision made using these estimates.</span></div></div><label className="notice-consent"><input type="checkbox" checked={noticeConfirmed} onChange={(event) => setNoticeConfirmed(event.target.checked)} /> <span>I understand that this is informational only and accept the limitation above.</span></label><button className="notice-accept" disabled={!noticeConfirmed} onClick={acceptNotice}>Accept & enter application <ArrowUpRight size={16} /></button><div className="notice-foot"><Landmark size={14} /> Official market-value verification remains separate from this estimate.</div></section></main>;


  return (
      <main className="app-shell">
        <header className="topbar">
          <div className="brand-lockup">
            <div className="brand-mark"><img src="/logo.png" alt="Ground Truth logo" /></div>
            <div><div className="brand-name">Ground Truth</div><div className="brand-kicker">INDIA / DEVELOPMENT ATLAS</div></div>
          </div>
          <div className="topbar-context"><label className="state-picker"><span>State</span><select aria-label="Select state" value={selectedState} onChange={(event) => selectState(event.target.value)}><option value="">Select a state</option>{states.map((state) => <option key={state} value={state}>{state}</option>)}</select></label>{selectedState && <label className="district-picker"><span>District</span><select aria-label="Select district" value={district} onChange={(event) => setDistrict(event.target.value)}>{districts.map((item) => <option key={item}>{item}</option>)}</select></label>}</div>
          <div className="topbar-actions"><button className="menu-button" aria-label={detailOpen ? "Close details" : "Open details"} onClick={() => selected && setMobilePanel((open) => !open)}><Menu size={19} /></button></div>
        </header>

        <section className={`workspace ${detailOpen ? "has-detail" : ""}`} style={{ ["--info-width" as string]: `${infoWidth}px` }}>
          <section className="map-stage">
            <div className="map-canvas">
              <div className="map-paper-grain" />
              <div className="map-grid" />
              <div className="route route-a" /><div className="route route-b" /><div className="route route-c" />
              <ExactRegionMap geometries={selectedState ? geometries : []} regions={selectedState ? regions : []} infrastructures={infrastructures} activeTypes={activeTypes} showProjects={showProjects} selectedId={selectedId} onSelect={(regionId) => { setSelectedId(regionId); setMobilePanel(true); }} />
              {selectedState && !isLoading && !regions.length && <div className="map-empty-state">No region records are available for this state yet.</div>}
              <div className="map-scale"><span>0</span><i /><span>50 km</span></div><div className="map-compass"><span>N</span><Navigation size={19} /></div>
              <div className="map-stamp"><ShieldCheck size={14} /> PUBLIC SOURCES ONLY</div>
            </div>
          </section>

          {detailOpen && <><div className="info-resize-divider" role="separator" aria-label="Resize information panel" onPointerDown={startInfoResize} /><aside className="evidence-rail mobile-open">
            <div className="rail-close-mobile"><button onClick={() => setMobilePanel(false)}><X size={18} /></button></div>
            <label className={`detail-search ${!selectedState ? "is-disabled" : ""}`}><Search size={15} /><input disabled={!selectedState} value={query} onChange={(event) => setQuery(event.target.value)} placeholder={selectedState ? "Search region or infrastructure" : "Select a state to search"} /><kbd>/</kbd></label>
            {selectedState && query && <div className="search-results">{filteredRegions.slice(0, 5).map((region) => <button key={region.id} onClick={() => { setSelectedId(region.id); setMobilePanel(true); }}><span className={`mini-dot ${region.direction}`} />{region.name}<small>{region.district}</small></button>)}</div>}
            {selected ? <>
              <div className="record-top"><span className="record-label">REGION RECORD / 0{regions.findIndex((r) => r.id === selected.id) + 1}</span></div>
              <div className="region-title"><h2>{selected.name}</h2><p>{selected.district} district <span>·</span> {selected.state || selectedState}</p></div>
              <div className="value-block"><div className="value-meta"><span>APPROX. CURRENT VALUE</span><span className="data-date">Base value · Jan 2026</span></div><div className="value-number">{formatINR(selected.value)}<small>/{selected.unit.replace("per ", "")}</small></div><a className="official-link" href={officialValueUrl} target="_blank" rel="noreferrer"><Landmark size={15} /> Check official government market value <ExternalLink size={13} /></a><form className="prediction-form" onSubmit={(event) => { event.preventDefault(); void runPrediction(); }}><div className="prediction-form-heading"><span>YOUR PROPERTY SCENARIO</span><small>Compare a personal input with the regional signal</small></div><label>Current property value<input inputMode="numeric" type="number" min="1" placeholder="e.g. 5200000" value={propertyValue} onChange={(event) => { setPropertyValue(event.target.value); setPrediction(null); }} /></label><label>Property type<select value={propertyType} onChange={(event) => { setPropertyType(event.target.value); setPrediction(null); }}><option>Plot</option><option>Apartment</option><option>Independent house</option><option>Commercial</option></select></label><label>Prediction horizon<select value={horizonMonths} onChange={(event) => { setHorizonMonths(Number(event.target.value)); setPrediction(null); }}><option value={6}>6 months</option><option value={12}>1 year</option><option value={24}>2 years</option><option value={36}>3 years</option><option value={48}>4 years</option><option value={60}>5 years</option></select></label><button className="predict-button" type="submit" disabled={!propertyValue || isPredicting}>{isPredicting ? "Calculating signal…" : "Predict future price"}<ArrowUpRight size={14} /></button>{prediction && <div className="prediction-result"><div><span>ESTIMATED RANGE · {prediction.horizonMonths === 60 ? "5 YEARS" : `${prediction.horizonMonths} MONTHS`}</span><strong>{formatINR(prediction.low)} — {formatINR(prediction.high)}</strong></div><p>{prediction.methodology}</p></div>}</form></div>
              <div className="projection-block"><div className="value-meta"><span>GROUND TRUTH PROJECTION</span><span className={`confidence-badge ${selected.confidence ? "" : "low"}`}>{selected.confidence ? `${Math.round(selected.confidence * 100)}% confidence` : "No estimate"}</span></div>{selected.projected ? <><div className="projection-number"><span>{formatINR(selected.projected[0])}</span><i>—</i><span>{formatINR(selected.projected[1])}</span></div><div className={`change-pill ${selected.direction}`}><ArrowUpRight size={15} /> {range ? `${range[0].toFixed(1)}–${range[1].toFixed(1)}%` : ""} projected change</div></> : <div className="no-projection"><Minus size={16} /> No recent development signal is strong enough to publish a range.</div>}</div>
              <div className="tab-bar"><button className={activeTab === "drivers" ? "active" : ""} onClick={() => setActiveTab("drivers")}>What moves it <span>{selectedDrivers.length}</span></button><button className={activeTab === "evidence" ? "active" : ""} onClick={() => setActiveTab("evidence")}>Evidence trail <span>{evidence.length}</span></button></div>
              {activeTab === "drivers" ? <div className="drivers-list">{selectedDrivers.length ? selectedDrivers.map((driver, index) => <article className="driver-card" key={driver.id}><div className="driver-image"><img src={driver.image} alt={`${driver.name} reference`} /><span className="driver-index">0{index + 1}</span><span className="driver-type">{iconFor(driver.type)} {driver.type}</span></div><div className="driver-content"><div className="driver-heading"><h3>{driver.name}</h3><span className="driver-status">{driver.status}</span></div><p>{driver.summary}</p><div className="driver-metrics"><div><span>EST. CONTRIBUTION</span><strong className={driver.contribution[0] < 0 ? "negative" : ""}>{driver.contribution[0] > 0 ? "+" : ""}{driver.contribution[0]}–{driver.contribution[1]}<small> pp</small></strong></div><div><span>TIME HORIZON</span><strong>{driver.timeline}</strong></div></div><button className="evidence-button" onClick={() => setActiveTab("evidence")}>Read {driver.sourceCount} source{driver.sourceCount > 1 ? "s" : ""} <ChevronRight size={14} /></button></div></article>) : <div className="empty-note"><FileText size={22} /><strong>Quiet ground, for now.</strong><span>No infrastructure driver has enough evidence to publish for this region.</span></div>}</div> : <div className="evidence-list">{evidence.map((item) => <article className="evidence-item" key={item.id}><div className="evidence-marker"><Newspaper size={13} /></div><div><div className="evidence-source">{item.publisher}<span>· {item.publishedAt}</span></div><h3>{item.title}</h3>{item.url && <a href={item.url} target="_blank" rel="noreferrer">Open source <ExternalLink size={12} /></a>}</div></article>)}</div>}
              <div className="rail-disclaimer"><ShieldCheck size={15} /><span>Estimate based on public news reports, not financial advice. Verify any decision with a licensed valuer.</span></div>
            </> : <div className="region-empty-state"><div className="empty-state-number">01</div><MapPin size={28} /><h2>Choose a region</h2><p>Select a state above, then click a mapped region to open its current value, infrastructure signals, evidence trail, and personalized estimate.</p><span className="empty-state-rule" /></div>}
          </aside></>}
        </section>

      </main>
  );
}
