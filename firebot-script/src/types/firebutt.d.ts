interface ScriptParameters {
  [id: string]: {
    name: string;
    scriptName: string;
    parameters: {
      [parameterName: string]: {
        type: string;
        default: boolean;
        title: string;
        description: string;
        value: string | number | boolean;
      };
    };
  };
}
