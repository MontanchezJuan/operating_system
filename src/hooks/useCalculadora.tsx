import { useState } from "react";
import { Symbol } from "../interfaces/apps/Calculator.interface";

export type Operadores = "/" | "*" | "-" | "+" | "%" | "0";

export const useCalculadora = () => {
  const [numero, setNumero] = useState<string>("0");
  const [numeroAnterior, setNumeroAnterior] = useState<string>("0");
  const [operator, setOperator] = useState<Operadores>("0");
  const [cache, setCache] = useState<{ numero: string; operator: Operadores }>({
    numero: "0",
    operator: "+",
  });

  // Limpia la calculadora
  const limpiar = () => {
    setNumero("0");
    setNumeroAnterior("0");
    setOperator("0");
  };

  // Limpia solo el número actual
  const clearNumber = () => {
    setNumero("0");
  };

  // Agrega un número al estado actual
  const armarNumero = (numeroTexto: string) => {
    // No aceptar doble punto
    if (numero.includes(".") && numeroTexto === ".") return;

    if (numero.startsWith("0") || numero.startsWith("-0")) {
      // Punto decimal
      if (numeroTexto === ".") {
        setNumero(numero + numeroTexto);

        // Evaluar si es otro cero, y hay un punto
      } else if (numeroTexto === "0" && numero.includes(".")) {
        setNumero(numero + numeroTexto);

        // Evaluar si es diferente de cero y no tiene un punto
      } else if (numeroTexto !== "0" && !numero.includes(".")) {
        setNumero(numeroTexto);

        // Evitar 0000.0
      } else if (numeroTexto === "0" && !numero.includes(".")) {
        setNumero(numero);
      } else {
        setNumero(numero + numeroTexto);
      }
    } else {
      setNumero(numero + numeroTexto);
    }
  };

  // Cambia el signo del número actual
  const positioNegativo = () => {
    setNumero(numero.includes("-") ? numero.replace("-", "") : "-" + numero);
  };

  const btnDelete = () => {
    let negativo = "";
    let numeroTemp = numero;
    if (numero.includes("-")) {
      negativo = "-";
      numeroTemp = numero.substr(1);
    }

    if (numeroTemp.length > 1) {
      setNumero(negativo + numeroTemp.slice(0, -1));
    } else {
      setNumero("0");
    }
  };

  // Convierte el número actual a porcentaje
  const btnPercent = () => {
    if (numero !== "0") {
      setNumero(`${Number(numero) / 100}`);
    }
  };

  // Calcula el cuadrado del número actual
  const btnSquare = () => {
    setNumero(`${Number(numero) ** 2}`);
  };

  // Calcula la raíz cuadrada del número actual
  const btnSquareRoot = () => {
    if (Number(numero) < 0) {
      alert("No se puede calcular la raíz cuadrada de un número negativo.");
      return;
    }
    setNumero(`${Math.sqrt(Number(numero))}`);
  };

  const btnReciprocal = () => {
    if (numero === "0") return;

    const num2 = Number(numero);

    const calculation: number = 1 / num2;

    if (numeroAnterior === "0") {
      setNumeroAnterior(`${calculation}`);
      setNumero("0");
    } else {
      setNumero(`${calculation}`);
      calcular();
    }
  };

  const cambiarNumPorAnterior = () => {
    if (numero.endsWith(".")) {
      setNumeroAnterior(numero.slice(0, -1));
    } else {
      setNumeroAnterior(numero);
    }
    setNumero("0");
  };

  const assignOperator = (newOperator: Operadores) => {
    // user change operator
    if (numero === "0") {
      setOperator(newOperator);
      return;
    }

    cambiarNumPorAnterior();
    setOperator(newOperator);
    setCache({ ...cache, operator: newOperator });
    calcular();
  };

  const calcular = (equals?: string) => {
    if (numeroAnterior === "0") return;

    const num1 = Number(numeroAnterior);
    const num2 = Number(operator === "0" ? cache.numero : numero);

    let calculation: number | null = null;

    switch (operator === "0" ? cache.operator : operator) {
      case "+":
        calculation = num1 + num2;
        break;

      case "-":
        calculation = num1 - num2;
        break;

      case "*":
        calculation = num1 * num2;
        break;

      case "/":
        calculation = num1 / num2;
        break;
    }

    if (equals === "=") {
      setOperator("0");
    }

    setCache({ ...cache, numero: `${num2}` });
    setNumeroAnterior(`${calculation}`);
    setNumero("0");
  };

  const SYMBOLS: Symbol[] = [
    { texto: "%", accion: btnPercent },
    { texto: "CE", accion: clearNumber },
    { texto: "C", accion: limpiar },
    { texto: "del", accion: btnDelete },
    { texto: "1/x", accion: btnReciprocal },
    { texto: "x^2", accion: btnSquare },
    { texto: "sqrt/x", accion: btnSquareRoot },
    { text: "/", action: assignOperator },
    { texto: "7", accion: armarNumero },
    { texto: "8", accion: armarNumero },
    { texto: "9", accion: armarNumero },
    { text: "*", action: assignOperator },
    { texto: "4", accion: armarNumero },
    { texto: "5", accion: armarNumero },
    { texto: "6", accion: armarNumero },
    { text: "-", action: assignOperator },
    { texto: "1", accion: armarNumero },
    { texto: "2", accion: armarNumero },
    { texto: "3", accion: armarNumero },
    { text: "+", action: assignOperator },
    { texto: "+/-", accion: positioNegativo },
    { texto: "0", accion: armarNumero },
    { texto: ".", accion: armarNumero },
    { texto: "=", equals: true, accion: calcular },
  ];

  return {
    numero,
    numeroAnterior,
    operator,
    SYMBOLS,
  };
};
