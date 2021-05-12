import './App.css';
import { unitDefs, UnitCalculator, ContextProvider as UnitCalculatorContextProvider } from './UnitCalculator';

function App() {

  return (
    <div className="App">
      <UnitCalculatorContextProvider>
        <UnitCalculator unitDef={unitDefs.milliMator} />
        <UnitCalculator unitDef={unitDefs.microMator} />
        <UnitCalculator unitDef={unitDefs.sun} />
      </UnitCalculatorContextProvider>
    </div>
  );
}

export default App;
