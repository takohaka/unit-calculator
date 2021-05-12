import { createContext, useContext, useEffect, useRef, useState } from 'react';
import './UnitCalculator.css'

export const unitDefs = {
  milliMator: {
    key: 'milliMator',
    rate: 1 / 1000,
    symbol: 'mm',
    name: 'ミリメートル',
    description: ''
  },
  microMator: {
    key: 'microMator',
    rate: 1 / 1000 / 1000,
    symbol: 'µm',
    name: 'マイクロメートル',
    description: ''
  },
  sun: {
    key: 'sun',
    rate: 0.030303,
    symbol: '寸',
    name: '寸',
    description: ''
  },
};

export const context = createContext({
  focusedUnit: null,
  setFocusedUnit: () => {},
  calculationBase: {
    unit: null,
    num: null
  },
  setCalculationBase: () => {},
  calculated: {
    milliMator: 0,
    microMator: 0
  }
});

// Provider
export function ContextProvider({ children }) {
  const [focusedUnit, setFocusedUnit] = useState(null);
  const [calculationBase, setCalculationBase] = useState(null);
  const [calculated, setCalculated] = useState(null);

  // 換算元の単位と値が更新された時
  useEffect(() => {

    if (calculationBase) {
      const calculated = Object.keys(unitDefs).reduce(function (result, key) {
        console.log(key);
        result[key] = (1 / unitDefs[key].rate) * unitDefs[calculationBase.unit].rate * calculationBase.num;
        return result;
      }, {});

      setCalculated(calculated);
    }

  }, [calculationBase]);

  return (
    <context.Provider value={{calculationBase, setCalculationBase, calculated, focusedUnit, setFocusedUnit}}>
      { children }
    </context.Provider>
  );
}

// Component
export function UnitCalculator(props) {
  const { calculated, calculationBase, setCalculationBase, focusedUnit, setFocusedUnit } = useContext(context);

  const [isShowInput, setIsShowInput] = useState(false);
  const [inputValue, setInputValue] = useState('');

  const inputRef = useRef();

  function onTextClick() {
    setFocusedUnit(props.unitDef.key);
  }

  function onCalcBtnClick() {
    const num = Number(inputValue);
    if (!Number.isNaN(num)) {
      setCalculationBase({
        num,
        unit: props.unitDef.key
      });
    } else {
      alert('入力値が正しい値ではありません。')
    }
  }

  // 入力欄のDOMの表示・非表示が切り替わった時に表示された入力欄にフォーカスする
  useEffect(() => {
    if (isShowInput && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isShowInput])

  // フォーカスされている単位が変わった時と換算が行われた時に
  // 入力欄の表示・非表示のstateと表示値を更新する。
  useEffect(() => {
    if (focusedUnit === props.unitDef.key) {
      setIsShowInput(true);
    } else {
      setIsShowInput(false);
      if (calculated) {
        setInputValue(calculated[props.unitDef.key]);
      } else {
        setInputValue('');
      }
    }
  }, [focusedUnit, props.unitDef, calculated]);

  return (
    <div className="unit-calculator">
      <div className="unit-calculator__title">
        { props.unitDef.name } ({ props.unitDef.symbol })
      </div>
      <div className="unit-calculator__body">
        {
          isShowInput
            ? (
              <div>
                <input type="text" onChange={e => setInputValue(e.target.value)} value={inputValue} ref={inputRef} />
                { props.unitDef.symbol }
                <button type="button" onClick={onCalcBtnClick}>換算</button>
              </div>
            )
            : (
              <div onClick={onTextClick}>
                {
                  calculationBase && calculated
                    ? (
                      <div>
                        { calculated[props.unitDef.key] }
                        { props.unitDef.symbol }
                      </div>
                    )
                    : (
                      <div>
                        ここをクリックして入力します。
                      </div>
                    )
                }
              </div>
            )
        }
      </div>
    </div>
  );
}
