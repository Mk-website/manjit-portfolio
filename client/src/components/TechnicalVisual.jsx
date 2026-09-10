export function SystemDiagram() {
  return <div className="panel tech-grid p-5 sm:p-6" aria-label="Embedded system architecture diagram">
    <div className="flex items-center justify-between text-[.68rem] font-mono text-cyan-300"><span>SYSTEM ARCHITECTURE</span><span className="flex items-center gap-2"><i className="signal-dot" />LINK ACTIVE</span></div>
    <div className="mt-7 flex items-center gap-2"><div className="tech-node">STM32<br /><b className="text-cyan-300">F401</b></div><div className="tech-link" /><div className="tech-node">RF LINK<br /><b className="text-cyan-300">LoRa</b></div><div className="tech-link" /><div className="tech-node">CONTROL<br /><b className="text-cyan-300">PPM/PWM</b></div></div>
    <div className="mt-5 grid grid-cols-2 gap-3"><div className="tech-node">UART / SPI / I2C</div><div className="tech-node">GPS / OLED / SD</div></div>
    <div className="mt-5 border-t border-slate-700 pt-4 text-xs leading-6 text-slate-400">Flight controller and cloud telemetry paths are connected through deliberate, testable interfaces.</div>
  </div>;
}

export function ProjectVisual({ project }) {
  const weather = /weather/i.test(project.name || '');
  return <div className="tech-grid flex aspect-video flex-col justify-between border-b border-slate-800 p-5">
    <div className="flex items-center justify-between font-mono text-[.68rem] text-cyan-300"><span>{weather ? 'TELEMETRY PIPELINE' : 'REGISTER MAP'}</span><span>01</span></div>
    {weather ? <div className="flex items-center gap-2"><div className="tech-node">ESP32</div><div className="tech-link" /><div className="tech-node">AZURE<br />IOT</div><div className="tech-link" /><div className="tech-node">ALERTS</div></div> : <div className="grid grid-cols-3 gap-2"><div className="tech-node">GPIO</div><div className="tech-node">I2C</div><div className="tech-node">SPI</div><div className="tech-node">UART</div><div className="tech-node col-span-2">STM32F401</div></div>}
    <span className="font-mono text-[.68rem] text-slate-500">CSS SYSTEM VISUAL</span>
  </div>;
}
