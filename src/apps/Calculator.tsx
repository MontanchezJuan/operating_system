import { LiaCalculatorSolid } from "react-icons/lia";

import { useTranslation } from "react-i18next";
import { globalColors } from "../data/data";
import { useCalculadora } from "../hooks/useCalculadora";
import { App } from "../interfaces/App.interface";
import { Symbol } from "../interfaces/apps/Calculator.interface";
import { Color } from "../interfaces/context/Config.interface";
import useStore from "../store/useStore";

const CalculatorButton = ({ texto, text, accion, action, equals }: Symbol) => {
  const color = useStore((store) => store.config.color);

  return (
    <button
      className={`${
        equals
          ? `${globalColors.bg[color as Color].darkHover} ${globalColors.bg[color as Color].base}`
          : "bg-zinc-600"
      } flex cursor-pointer items-center justify-center rounded-md py-2`}
      onClick={action ? () => action(text!) : () => accion!(texto!)}
    >
      {text}
      {texto}
    </button>
  );
};

const Calculator = () => {
  const { t } = useTranslation();

  const { numero, numeroAnterior, operator, SYMBOLS } = useCalculadora();

  return (
    <div className="dark-bg-primary flex h-full w-full flex-col px-4 pb-4">
      <div className="dark-text-title">{t(`Standard`)}</div>

      <div className="dark-text-title flex flex-grow flex-col items-end justify-end">
        {numeroAnterior !== "0" && (
          <p className="text-xl">
            {numeroAnterior}
            {operator !== "0" ? ` ${operator}` : ""}
          </p>
        )}

        <p className="text-3xl">{numero}</p>
      </div>

      <div className={`grid grid-cols-4 gap-1`}>
        {SYMBOLS.map((symbol, index) => (
          <CalculatorButton
            text={symbol.text}
            texto={symbol.texto}
            accion={symbol.accion}
            action={symbol.action}
            equals={symbol.equals ? symbol.equals : false}
            key={index}
          />
        ))}
      </div>
    </div>
  );
};

export const CalculatorApp: App = {
  app: Calculator,
  icon: LiaCalculatorSolid,
  isFullwindow: false,
  manyWindows: true,
  memory: 1,
  name: "Calculator",
  onClose: () => {},
};
