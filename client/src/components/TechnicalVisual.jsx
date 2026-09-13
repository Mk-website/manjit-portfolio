export function SystemDiagram({ nodes = [] }) {
  const diagramNodes = Array.isArray(nodes) && nodes.length >= 3 ? nodes.slice(0, 3) : ['MCU', 'LINK', 'CONTROL'];

  return <div className="panel tech-grid system-diagram p-5 sm:p-6" aria-label="Embedded system architecture diagram">
    <div className="diagram-label"><span>SYSTEM ARCHITECTURE</span><span className="diagram-status"><i className="signal-dot" />LINK ACTIVE</span></div>
    <div className="diagram-flow" aria-hidden="true">
      {diagramNodes.map((node, index) => <div className="diagram-node-wrap" key={`${node}-${index}`}>
        <div className="tech-node diagram-node"><span>{node}</span><b className="diagram-accent">{index === 0 ? 'CORE' : index === 1 ? 'LINK' : 'EDGE'}</b></div>
        {index < diagramNodes.length - 1 && <div className="tech-link signal-link"><span className="data-packet" /></div>}
      </div>)}
    </div>
    <div className="diagram-support-grid"><div className="tech-node">INTERFACE BUS</div><div className="tech-node">FIELD SIGNAL</div></div>
    <div className="system-note">A decorative signal path representing deliberate, testable interfaces.</div>
  </div>;
}

export function ProjectVisual({ project, index = 0 }) {
  const weather = /weather/i.test(project.name || '');
  const nodes = weather ? ['ESP32', 'AZURE IOT', 'ALERTS'] : ['GPIO', 'I2C', 'SPI', 'UART', 'STM32F401'];
  return <div className={`case-visual tech-grid ${weather ? 'is-weather' : 'is-firmware'}`}>
    <div className="visual-topline"><span>{weather ? 'TELEMETRY PIPELINE' : 'REGISTER MAP'}</span><span>{String(index + 1).padStart(2, '0')} / LIVE</span></div>
    <div className="visual-system">
      {nodes.map((node, nodeIndex) => <div className="visual-node-wrap" key={node}>
        <div className="visual-node">{node}</div>
        {nodeIndex < nodes.length - 1 && <div className="visual-connector" />}
      </div>)}
    </div>
    <div className="visual-footer"><span>ENGINEERING SYSTEM</span><span className="visual-pulse" /></div>
  </div>;
}
