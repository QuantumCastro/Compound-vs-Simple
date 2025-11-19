type FieldConfig = {
  label: string;
  helper: string;
  placeholder?: string;
};

type AppDictionary = {
  app: {
    name: string;
    shortDescription: string;
  };
  header: {
    tagline: string;
    languageToggleAria: string;
    themeToggleAria: string;
    currencyLabel: string;
    currencyOptions: {
      USD: string;
      CRC: string;
    };
  };
  nav: {
    skipToMain: string;
  };
  hero: {
    title: string;
    subtitle: string;
    educationalDisclaimer: string;
    legalDisclaimer: string;
    cta: string;
  };
  form: {
    title: string;
    description: string;
    reset: string;
    fields: {
      principal: FieldConfig;
      ratePercent: FieldConfig;
      periods: FieldConfig;
      compoundFrequency: FieldConfig;
      contributionsEnabled: FieldConfig;
      contribution: FieldConfig;
      currency: {
        label: string;
      };
    };
  };
  validations: {
    required: string;
    minInclusive: string;
    maxInclusive: string;
    range: string;
    integer: string;
  };
  results: {
    title: string;
    subtitle: string;
    summary: {
      finalSimple: string;
      finalCompound: string;
      interestSimple: string;
      interestCompound: string;
      contributions: string;
      difference: string;
      effectiveSimple: string;
      effectiveCompound: string;
      breakEven: string;
      breakEvenNever: string;
    };
    charts: {
      comparison: {
        title: string;
        description: string;
        legendSimple: string;
        legendCompound: string;
      };
      gap: {
        title: string;
        description: string;
        legendGap: string;
      };
    };
    export: {
      title: string;
      csv: string;
      csvSuccess: string;
      error: string;
    };
    table: {
      title: string;
      description: string;
      columnPeriod: string;
      columnSimpleTotal: string;
      columnSimpleInterest: string;
      columnCompoundTotal: string;
      columnCompoundInterest: string;
      columnContribution: string;
      columnGap: string;
      showMore: string;
      showLess: string;
      ariaLabel: string;
    };
    states: {
      invalidInput: string;
      zeroPeriods: string;
    };
  };
  actions: {
    switchToSpanish: string;
    switchToEnglish: string;
    switchToLightTheme: string;
    switchToDarkTheme: string;
    copySuccess: string;
  };
  aria: {
    chartComparison: string;
    chartGap: string;
  };
  education: { header: { title: string; subtitle: string; }; sections: {
      id: string;
      title: string;
      summary: string;
      points?: string[];
      items?: { title: string; description: string }[];
      qa?: { question: string; answer: string }[];
      terms?: { term: string; definition: string }[];
      myths?: { myth: string; reality: string }[];
      references?: { label: string; url: string }[];
    }[];
    progress: {
      loaded: string;
      complete: string;
    };
  };
};

const en: AppDictionary = {
  app: {
    name: "Interest Growth Explorer",
    shortDescription: "Understand how your capital grows with simple and compound interest.",
  },
  header: {
    tagline: "Interactive guide.",
    languageToggleAria: "Switch interface language",
    themeToggleAria: "Switch color theme",
    currencyLabel: "Currency",
    currencyOptions: {
      USD: "USD",
      CRC: "CRC",
    },
  },
  nav: {
    skipToMain: "Skip to main content",
  },
  hero: {
    title: "Compare simple and compound growth with realistic scenarios",
    subtitle:
      "Adjust initial capital, monthly contributions and compounding frequency to see how balances change over time.",
    educationalDisclaimer:
      "Educational content only. Results ignore taxes, fees and inflation and should not be interpreted as financial advice.",
    legalDisclaimer:
      "Past performance does not guarantee future results. Always double-check inputs before making financial decisions.",
    cta: "Start experimenting",
  },
  form: {
    title: "Set up your scenario",
    description: "All calculations use monthly periods. Values update instantly as you type.",
    reset: "Reset inputs",
    fields: {
      principal: {
        label: "Initial capital",
        helper: "Amount invested at period 0.",
        placeholder: "1,000",
      },
      ratePercent: {
        label: "Return per period (%)",
        helper: "Percentage applied once per period. Negative values model losses.",
      },
      periods: {
        label: "Number of periods (months)",
        helper: "Between 0 and 480. One period equals one month.",
      },
      compoundFrequency: {
        label: "Reinvestments per period",
        helper: "Times the interest is compounded within each period (1 to 12).",
      },
      contributionsEnabled: {
        label: "Enable regular contributions",
        helper: "Add the same amount after each period to simulate recurring deposits.",
      },
      contribution: {
        label: "Contribution per period",
        helper: "Deposited after interest is applied in every period.",
        placeholder: "100",
      },
      currency: {
        label: "Display currency",
      },
    },
  },
  validations: {
    required: "Please enter a number.",
    minInclusive: "Value must be greater than or equal to {{min}}.",
    maxInclusive: "Value must be less than or equal to {{max}}.",
    range: "Value must be between {{min}} and {{max}}.",
    integer: "Value must be a whole number.",
  },
  results: {
    title: "Key metrics",
    subtitle:
      "Totals include principal and (if enabled) contributions. Interest values are shown before rounding in the charts.",
    summary: {
      finalSimple: "Simple interest total",
      finalCompound: "Compound interest total",
      interestSimple: "Simple interest earned",
      interestCompound: "Compound interest earned",
      contributions: "Total contributions",
      difference: "Compound advantage",
      effectiveSimple: "Effective annualized growth (simple)",
      effectiveCompound: "Effective annualized growth (compound)",
      breakEven: "Compound surpasses simple at period {{period}}",
      breakEvenNever: "Compound does not surpass simple within the selected horizon.",
    },
    charts: {
      comparison: {
        title: "Balance comparison over time",
        description:
          "Line chart comparing simple and compound balances per period. Horizontal axis shows periods, vertical axis shows total balance in the selected currency.",
        legendSimple: "Simple balance",
        legendCompound: "Compound balance",
      },
      gap: {
        title: "Compound advantage by period",
        description:
          "Area chart showing the difference between compound and simple balances. Values below zero are truncated to zero for readability.",
        legendGap: "Compound - Simple",
      },
    },
    export: {
      title: "Export your results",
      csv: "Download CSV",
      csvSuccess: "CSV generated successfully.",
      error: "Export failed. Please try again.",
    },
    table: {
      title: "Timeline breakdown",
      description:
        "Totals use full precision but are rounded visually to two decimals. Contributions are applied after interest at the end of each period.",
      columnPeriod: "Period",
      columnSimpleTotal: "Simple total",
      columnSimpleInterest: "Simple interest",
      columnCompoundTotal: "Compound total",
      columnCompoundInterest: "Compound interest",
      columnContribution: "Contribution",
      columnGap: "Compound advantage",
      showMore: "Show next {{count}} periods",
      showLess: "Show fewer rows",
      ariaLabel: "Detailed financial timeline table",
    },
    states: {
      invalidInput: "Review the highlighted fields to generate the comparison.",
      zeroPeriods: "Add at least one period to view growth over time.",
    },
  },
  actions: {
    switchToSpanish: "View in Spanish",
    switchToEnglish: "Switch to English",
    switchToLightTheme: "Use light mode",
    switchToDarkTheme: "Use dark mode",
    copySuccess: "Copied!",
  },
  aria: {
    chartComparison: "Interactive chart comparing simple and compound balances",
    chartGap: "Interactive chart showing the gap between compound and simple balances",
  },
  education: {
    header: {
      title: "Learning hub",
      subtitle: "Scroll to explore theory, examples and references at your own pace.",
    }, sections: [
      {
        id: "fundamentals",
        title: "Fundamentals at a glance",
        summary:
          "Simple interest grows linearly, while compound interest reinvests earnings and accelerates over time.",
        points: [
          "Simple interest applies the rate to the same principal every period, so growth follows a straight line.",
          "Compound interest recalculates from the updated balance, so early reinvestments influence later gains.",
          "Recurring contributions have a stronger impact under compounding because each deposit starts generating interest in the following period.",
        ],
      },
      {
        id: "calculation-rules",
        title: "Calculation rules used in the simulator",
        summary:
          "We apply transparent formulas so you can reproduce the numbers in a spreadsheet or by hand.",
        items: [
          {
            title: "Simple balance per period",
            description:
              "Balance_n = Principal + Contributions_cumulative + Principal×rate×n. Contributions start producing simple interest in the period after they are added.",
          },
          {
            title: "Compound balance with intra-period frequency",
            description:
              "Balance_n = (Balance_{n-1} + Contribution) × (1 + rate/compoundFrequency)^{compoundFrequency}. Negative rates decrease the balance before new deposits are added.",
          },
          {
            title: "Contribution timing",
            description:
              "Deposits happen at the end of each period after interest is applied. This mirrors the most conservative assumption for savings and avoids overstating growth.",
          },
        ],
      },
      {
        id: "scenarios",
        title: "Reference scenarios to explore",
        summary:
          "Try these combinations to observe how the curves react under different assumptions.",
        items: [
          {
            title: "Consistent savings discipline",
            description:
              "P = 1,000 · r = 8% · periods = 120 · frequency = 12 · contribution = 100. Compound interest reaches a much higher balance because deposits are reinvested monthly.",
          },
          {
            title: "Flat growth baseline",
            description:
              "P = 1,500 · r = 0% · no contributions. Both curves remain flat, useful to validate that formatting and exports behave as expected.",
          },
          {
            title: "Stress test with negative rate",
            description:
              "P = 5,000 · r = -5% · periods = 24. Observe how balances shrink while the UI keeps totals above zero visually to avoid misleading axes.",
          },
        ],
      },
      {
        id: "edge-cases",
        title: "Edge cases handled in the UI",
        summary:
          "We include guardrails so extreme inputs remain understandable without hiding the underlying math.",
        points: [
          "Zero periods returns the starting capital plus the first contribution (if enabled) with no interest applied.",
          "Negative rates are accepted and shown as declining balances; charts clamp at zero for legibility but exports keep raw values.",
          "Compound frequency is limited to 12 to match monthly periods and avoid misleading micro-compounding.",
          "Rates above 1,000% are blocked because they usually indicate an input error.",
        ],
      },
      {
        id: "faq",
        title: "Frequently asked questions",
        summary:
          "Clarifications for the most common doubts before you compare scenarios or share results.",
        qa: [
          {
            question: "Do the calculations include taxes, commissions or inflation?",
            answer:
              "No. The simulator focuses on the mathematical difference between growth models. You can approximate costs manually by adjusting the rate downward.",
          },
          {
            question: "When are contributions applied during a period?",
            answer:
              "At the end of each period after interest is calculated. This conservative assumption avoids overstating growth and matches the documentation in the worklog.",
          },
          {
            question: "How is the effective annual growth reported?",
            answer:
              "We compute a simplified compound annual growth rate using the final balance divided by the capital invested (principal + contributions), raised to 12/periods. It is indicative only because it treats contributions as if they were deposited upfront.",
          },
        ],
      },
      {
        id: "glossary",
        title: "Key glossary",
        summary:
          "Definitions to ensure we use the same vocabulary across the UI, documentation and exports.",
        terms: [
          {
            term: "Principal",
            definition: "Initial amount invested before interest or contributions.",
          },
          {
            term: "Rate per period",
            definition:
              "Percentage applied once per period. A value of 8 means 8% each period, not annual unless you set periods to 12.",
          },
          {
            term: "Compound frequency",
            definition:
              "How many times interest is recalculated within a period. A value of 4 means quarterly compounding in each monthly period.",
          },
          {
            term: "Contribution",
            definition: "Recurring deposit added after interest to simulate savings discipline.",
          },
          {
            term: "Effective annual growth",
            definition:
              "An estimated yearly rate derived from total growth. It helps compare scenarios with different horizons.",
          },
        ],
      },
      {
        id: "myths",
        title: "Myths vs. reality",
        summary:
          "Balanced statements to keep expectations realistic when presenting the concept to learners.",
        myths: [
          {
            myth: "Compound interest always beats simple interest immediately.",
            reality:
              "Compound growth needs time. With negative rates or very short horizons the advantage may be minimal or even absent.",
          },
          {
            myth: "Higher compounding frequency is always better.",
            reality:
              "Frequency amplifies both gains and losses. At negative rates, more frequent compounding erodes the balance faster.",
          },
          {
            myth: "You must reinvest 100% of your gains to benefit from compounding.",
            reality:
              "Partial reinvestment still compounds the reinvested portion. The simulator assumes full reinvestment to illustrate the upper bound.",
          },
        ],
      },
      {
        id: "performance",
        title: "Performance and accessibility targets",
        summary:
          "These guidelines keep the exported site fast and inclusive when hosted on any CDN.",
        points: [
          "Largest Contentful Paint ≤ 2 seconds on a mid-tier mobile device over 4G. Aim for a lean hero and minimal blocking scripts.",
          "Initial JavaScript bundle ≤ 200 KB gzip. Custom charts use inline SVG to stay within budget.",
          "All interactive controls support keyboard navigation and announce state changes via aria attributes.",
          "Use Lighthouse and WebPageTest to validate Core Web Vitals before shipping a release.",
        ],
      },
      {
        id: "references",
        title: "References and further reading",
        summary:
          "Authoritative sources you can cite in documentation or share with learners for deeper dives.",
        references: [
          {
            label: "Investopedia - Simple Interest Overview",
            url: "https://www.investopedia.com/terms/s/simple_interest.asp",
          },
          {
            label: "Investopedia - Compound Interest Explained",
            url: "https://www.investopedia.com/terms/c/compoundinterest.asp",
          },
          {
            label: "U.S. SEC - Compound Interest Calculator Guidance",
            url: "https://www.investor.gov/financial-tools-calculators/calculators/compound-interest-calculator",
          },
        ],
      },
    ],
    progress: {
      loaded: "Loaded {{loaded}} of {{total}} learning sections.",
      complete: "All learning sections are visible.",
    },
  },
};

const es: AppDictionary = {
  app: {
    name: "Explorador de Crecimiento del Interés",
    shortDescription: "Comprende cómo crece tu capital con interés simple y compuesto.",
  },
  header: {
    tagline: "Guía interactiva.",
    languageToggleAria: "Cambiar el idioma de la interfaz",
    themeToggleAria: "Cambiar modo de color",
    currencyLabel: "Moneda",
    currencyOptions: {
      USD: "USD",
      CRC: "CRC",
    },
  },
  nav: {
    skipToMain: "Ir al contenido principal",
  },
  hero: {
    title: "Compara el crecimiento simple y compuesto con escenarios realistas",
    subtitle:
      "Ajusta capital inicial, aportes mensuales y frecuencia de reinversión para ver cómo cambia el saldo con el tiempo.",
    educationalDisclaimer:
      "Contenido educativo únicamente. Los resultados no consideran impuestos, comisiones ni inflación y no constituyen asesoría financiera.",
    legalDisclaimer:
      "El rendimiento pasado no garantiza resultados futuros. Verifica tus entradas antes de tomar decisiones financieras.",
    cta: "Comienza a experimentar",
  },
  form: {
    title: "Configura tu escenario",
    description:
      "Todos los cálculos usan periodos mensuales. Los valores se actualizan al instante mientras escribes.",
    reset: "Restablecer entradas",
    fields: {
      principal: {
        label: "Capital inicial",
        helper: "Monto invertido en el periodo 0.",
        placeholder: "1.000",
      },
      ratePercent: {
        label: "Rendimiento por periodo (%)",
        helper: "Porcentaje aplicado una vez por periodo. Valores negativos modelan pérdidas.",
      },
      periods: {
        label: "Número de periodos (meses)",
        helper: "Entre 0 y 480. Un periodo equivale a un mes.",
      },
      compoundFrequency: {
        label: "Reinversiones por periodo",
        helper: "Veces que el interés se capitaliza dentro de cada periodo (1 a 12).",
      },
      contributionsEnabled: {
        label: "Habilitar aportes periódicos",
        helper: "Agrega el mismo monto al final de cada periodo para simular depósitos recurrentes.",
      },
      contribution: {
        label: "Aporte por periodo",
        helper: "Depositado después de aplicar el interés en cada periodo.",
        placeholder: "100",
      },
      currency: {
        label: "Moneda de visualización",
      },
    },
  },
  validations: {
    required: "Ingresa un número válido.",
    minInclusive: "El valor debe ser mayor o igual que {{min}}.",
    maxInclusive: "El valor debe ser menor o igual que {{max}}.",
    range: "El valor debe estar entre {{min}} y {{max}}.",
    integer: "El valor debe ser un número entero.",
  },
  results: {
    title: "Métricas clave",
    subtitle:
      "Los totales incluyen capital y, si aplica, aportes. Los valores de interés se muestran antes del redondeo en las gráficas.",
    summary: {
      finalSimple: "Total con interés simple",
      finalCompound: "Total con interés compuesto",
      interestSimple: "Interés simple acumulado",
      interestCompound: "Interés compuesto acumulado",
      contributions: "Aportes totales",
      difference: "Ventaja del compuesto",
      effectiveSimple: "Crecimiento anualizado efectivo (simple)",
      effectiveCompound: "Crecimiento anualizado efectivo (compuesto)",
      breakEven: "El compuesto supera al simple en el periodo {{period}}",
      breakEvenNever: "El compuesto no supera al simple en el horizonte seleccionado.",
    },
    charts: {
      comparison: {
        title: "Comparación de saldo en el tiempo",
        description:
          "Gráfica de líneas que compara los saldos simple y compuesto por periodo. El eje horizontal muestra los periodos y el vertical el saldo total en la moneda seleccionada.",
        legendSimple: "Saldo simple",
        legendCompound: "Saldo compuesto",
      },
      gap: {
        title: "Ventaja del compuesto por periodo",
        description:
          "Gráfica de área que muestra la diferencia entre el saldo compuesto y el simple. Los valores negativos se truncan a cero para facilitar la lectura.",
        legendGap: "Compuesto - Simple",
      },
    },
    export: {
      title: "Exporta tus resultados",
      csv: "Descargar CSV",
      csvSuccess: "CSV generado correctamente.",
      error: "No se pudo exportar. Intenta nuevamente.",
    },
    table: {
      title: "Desglose por periodo",
      description:
        "Los totales usan máxima precisión pero se muestran con dos decimales. Los aportes se agregan después del interés al final de cada periodo.",
      columnPeriod: "Periodo",
      columnSimpleTotal: "Total simple",
      columnSimpleInterest: "Interés simple",
      columnCompoundTotal: "Total compuesto",
      columnCompoundInterest: "Interés compuesto",
      columnContribution: "Aporte",
      columnGap: "Ventaja compuesta",
      showMore: "Mostrar siguientes {{count}} periodos",
      showLess: "Mostrar menos filas",
      ariaLabel: "Tabla detallada de la línea de tiempo financiera",
    },
    states: {
      invalidInput: "Revisa los campos marcados para generar la comparación.",
      zeroPeriods: "Agrega al menos un periodo para ver el crecimiento en el tiempo.",
    },
  },
  actions: {
    switchToSpanish: "Ver en español",
    switchToEnglish: "Cambiar a inglés",
    switchToLightTheme: "Usar modo claro",
    switchToDarkTheme: "Usar modo oscuro",
    copySuccess: "Copiado",
  },
  aria: {
    chartComparison: "Gráfica interactiva que compara los saldos simple y compuesto",
    chartGap: "Gráfica interactiva que muestra la ventaja del saldo compuesto",
  },
  education: {
    header: {
      title: "Centro de aprendizaje",
      subtitle: "Desplázate para revisar teoría, ejemplos y referencias a tu ritmo.",
    }, sections: [
      {
        id: "fundamentals",
        title: "Fundamentos en un vistazo",
        summary:
          "El interés simple crece de forma lineal, mientras que el interés compuesto reinvierte las ganancias y acelera con el tiempo.",
        points: [
          "El interés simple aplica la tasa sobre el mismo principal en cada periodo, por lo que la curva es una línea recta.",
          "El interés compuesto recalcula desde el saldo actualizado, de modo que las primeras reinversiones potencian los resultados futuros.",
          "Los aportes periódicos pesan más en el compuesto porque cada depósito comienza a generar interés en el periodo siguiente.",
        ],
      },
      {
        id: "calculation-rules",
        title: "Reglas de cálculo utilizadas en la simulación",
        summary:
          "Aplicamos fórmulas transparentes para que puedas reproducir los números en una hoja de cálculo o a mano.",
        items: [
          {
            title: "Saldo simple por periodo",
            description:
              "Saldo_n = Principal + Aportes_acumulados + Principal×tasa×n. Cada aporte empieza a generar interés simple en el periodo posterior a su registro.",
          },
          {
            title: "Saldo compuesto con frecuencia intra-periodo",
            description:
              "Saldo_n = (Saldo_{n-1} + Aporte) × (1 + tasa/frecuencia)^{frecuencia}. Las tasas negativas reducen el saldo antes de sumar nuevos depósitos.",
          },
          {
            title: "Momento de los aportes",
            description:
              "Los depósitos se agregan al final de cada periodo después de aplicar el interés. Esta suposición conservadora evita sobreestimar el crecimiento y está documentada en el worklog.",
          },
        ],
      },
      {
        id: "scenarios",
        title: "Escenarios de referencia para explorar",
        summary:
          "Prueba estas combinaciones y observa cómo reaccionan las curvas bajo diferentes supuestos.",
        items: [
          {
            title: "Disciplina de ahorro constante",
            description:
              "P = 1.000 · r = 8 % · periodos = 120 · frecuencia = 12 · aporte = 100. El compuesto alcanza un saldo muy superior porque los depósitos se reinvierten mensualmente.",
          },
          {
            title: "Línea base sin crecimiento",
            description:
              "P = 1.500 · r = 0 % · sin aportes. Ambas curvas permanecen planas; útil para validar formato y exportaciones.",
          },
          {
            title: "Prueba de estrés con tasa negativa",
            description:
              "P = 5.000 · r = -5 % · periodos = 24. Observa cómo los saldos disminuyen mientras la interfaz mantiene el piso visual en cero para evitar ejes confusos.",
          },
        ],
      },
      {
        id: "edge-cases",
        title: "Casos borde cubiertos en la UI",
        summary:
          "Incluimos barandas para que los valores extremos sigan siendo comprensibles sin ocultar las matemáticas subyacentes.",
        points: [
          "Con cero periodos se devuelve el capital inicial más el primer aporte (si aplica) sin interés calculado.",
          "Las tasas negativas se aceptan y se muestran como saldos decrecientes; las gráficas limitan a cero solo para facilitar la lectura.",
          "La frecuencia de reinversión se limita a 12 para mantener consistencia con periodos mensuales y evitar micro-compounding engañoso.",
          "Las tasas superiores a 1.000 % se bloquean porque normalmente indican un error de entrada.",
        ],
      },
      {
        id: "faq",
        title: "Preguntas frecuentes",
        summary:
          "Aclaraciones sobre las dudas más comunes antes de comparar escenarios o compartir resultados.",
        qa: [
          {
            question: "¿Los cálculos incluyen impuestos, comisiones o inflación?",
            answer:
              "No. El simulador se centra en la diferencia matemática entre modelos de crecimiento. Puedes aproximar costos ajustando la tasa hacia abajo.",
          },
          {
            question: "¿En qué momento se aplican los aportes dentro del periodo?",
            answer:
              "Al final de cada periodo después de calcular el interés. Es una suposición conservadora que evita sobreestimar crecimientos y está documentada en el worklog.",
          },
          {
            question: "¿Cómo se reporta el crecimiento anualizado efectivo?",
            answer:
              "Calculamos una tasa anual compuesta simplificada usando el saldo final dividido entre el capital invertido (principal + aportes) elevado a 12/periodos. Es orientativa porque trata los aportes como si se depositaran al inicio.",
          },
        ],
      },
      {
        id: "glossary",
        title: "Glosario clave",
        summary:
          "Definiciones para mantener el mismo vocabulario en la interfaz, la documentación y las exportaciones.",
        terms: [
          {
            term: "Capital inicial",
            definition: "Monto invertido al inicio antes de intereses o aportes.",
          },
          {
            term: "Tasa por periodo",
            definition:
              "Porcentaje aplicado una vez por periodo. Un valor de 8 significa 8 % cada periodo; no es anual a menos que configures 12 periodos.",
          },
          {
            term: "Frecuencia de reinversión",
            definition:
              "Cantidad de veces que se recalcula el interés dentro de un periodo. Un valor de 4 implica capitalización trimestral dentro de cada mes.",
          },
          {
            term: "Aporte",
            definition: "Depósito recurrente agregado después del interés para simular el hábito de ahorro.",
          },
          {
            term: "Crecimiento anualizado efectivo",
            definition:
              "Tasa anual estimada derivada del crecimiento total. Ayuda a comparar escenarios con horizontes distintos.",
          },
        ],
      },
      {
        id: "myths",
        title: "Mitos vs. realidad",
        summary:
          "Mensajes equilibrados para mantener expectativas realistas al enseñar estos conceptos.",
        myths: [
          {
            myth: "El interés compuesto supera al simple de inmediato.",
            reality:
              "El compuesto necesita tiempo. Con tasas negativas o horizontes muy cortos la ventaja puede ser mínima o inexistente.",
          },
          {
            myth: "Mayor frecuencia siempre es mejor.",
            reality:
              "La frecuencia amplifica ganancias y pérdidas. Con tasas negativas, más capitalización acelera la caída del saldo.",
          },
          {
            myth: "Debes reinvertir el 100 % de las ganancias para aprovechar el compuesto.",
            reality:
              "La reinversión parcial también compone la porción reinvertida. El simulador asume reinversión total para mostrar el máximo teórico.",
          },
        ],
      },
      {
        id: "performance",
        title: "Metas de rendimiento y accesibilidad",
        summary:
          "Estas pautas mantienen el sitio exportado rápido e inclusivo en cualquier CDN.",
        points: [
          "Largest Contentful Paint ≤ 2 segundos en un móvil de gama media sobre 4G. Optimiza el hero y evita scripts bloqueantes.",
          "Bundle inicial de JavaScript ≤ 200 KB gzip. Las gráficas SVG personalizadas ayudan a cumplir el presupuesto.",
          "Todos los controles interactivos soportan navegación con teclado y anuncian cambios mediante atributos aria.",
          "Ejecuta Lighthouse y WebPageTest para validar Core Web Vitals antes de liberar una versión.",
        ],
      },
      {
        id: "references",
        title: "Referencias y lecturas recomendadas",
        summary:
          "Fuentes confiables que puedes citar en documentación o compartir con estudiantes para profundizar.",
        references: [
          {
            label: "Investopedia - Concepto de interés simple",
            url: "https://www.investopedia.com/terms/s/simple_interest.asp",
          },
          {
            label: "Investopedia - Interés compuesto explicado",
            url: "https://www.investopedia.com/terms/c/compoundinterest.asp",
          },
          {
            label: "U.S. SEC - Guía de calculadora de interés compuesto",
            url: "https://www.investor.gov/financial-tools-calculators/calculators/compound-interest-calculator",
          },
        ],
      },
    ],
    progress: {
      loaded: "Secciones cargadas: {{loaded}} de {{total}}.",
      complete: "Ya se muestran todas las secciones informativas.",
    },
  },
};

export const dictionaries: Record<Locale, AppDictionary> = {
  en,
  es,
};

export type Locale = "en" | "es";

export type TranslationDictionary = AppDictionary;









