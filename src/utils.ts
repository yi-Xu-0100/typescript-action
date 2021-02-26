import { getInput, debug, warning } from '@actions/core';

export function getBooleanInput(name: string): boolean {
  const trueValue = ['true', 'True', 'TRUE'];
  const falseValue = ['false', 'False', 'FALSE'];
  const stringInput = getInput(name);
  debug('[getBooleanInput.stringInput]: ' + stringInput);
  if (trueValue.indexOf(stringInput) > -1) return true;
  if (falseValue.indexOf(stringInput) > -1) return false;
  warning('YAML 1.2 "Core Schema" specification: https://yaml.org/spec/1.2/spec.html#id2804923');
  throw TypeError(`Input does not meet YAML 1.2 "Core Schema" specification: ${name}`);
}
