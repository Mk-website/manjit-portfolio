export function SystemDiagram() {
  return <div className="panel tech-grid p-5 sm:p-6" aria-label="Embedded system architecture diagram">
    <div className="flex items-center justify-between text-[.68rem] font-mono text-cyan-300"><span>SYSTEM ARCHITECTURE</span><span className="flex items-center gap-2"><i className="signal-dot" />LINK ACTIVE</span></div>
    <div className="mt-7 flex items-center gap-2"><div className="tech-node">STM32<br /><b className="text-cyan-300">F401</b></div><div className="tech-link" /><div className="tech-node">RF LINK<br /><b className="text-cyan-300">LoRa</b></div><div className="tech-link" /><div className="tech-node">CONTROL<br /><b className="text-cyan-300">PPM/PWM</b></div></div>
    <div className="mt-5 grid grid-cols-2 gap-3"><div className="tech-node">UART / SPI / I2C</div><div className="tech-node">GPS / OLED / SD</div></div>
    <div className="mt-5 border-t border-slate-700 pt-4 text-xs leading-6 text-slate-400">Flight controller and cloud telemetry paths are connected through deliberate, testable interfaces.</div>
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
