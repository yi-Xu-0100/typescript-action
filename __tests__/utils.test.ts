import { getBooleanInput } from '../src/utils';
import * as core from '@actions/core';

const defaultEnvVars = {
  GITHUB_REPOSITORY: 'yi-Xu-0100/typescript-action',
  RUNNER_DEBUG: '1'
};

// defaultInputs as defined in action.yml
const defaultInputs = {
  booleanInput: 'true'
};
// defaultOutputs as defined in action.yml
const defaultOutputs = {
  booleanOutput: 'unset'
};

let inputs: any;
let outputs: any;
let infoMessages: string[];
let debugMessages: string[];
let warningMessages: string[];
let errorMessages: string[];

describe('utils', () => {
  beforeAll(() => {
    for (let key in defaultEnvVars) {
      process.env[key] = defaultEnvVars[key as keyof typeof defaultEnvVars];
    }
    jest
      .spyOn(core, 'getInput')
      .mockImplementation((name: string, options?: core.InputOptions | undefined) => {
        const val: string = inputs[name] || defaultInputs[name as keyof typeof defaultInputs] || '';
        if (options?.required && !val) {
          throw new Error(`Input required and not supplied: ${name}`);
        }
        return val.trim();
      });
    jest.spyOn(core, 'setOutput').mockImplementation((name: string, value: any) => {
      outputs[name] = value;
    });
    jest.spyOn(core, 'info').mockImplementation((message: string): void => {
      infoMessages.push(message);
    });
    jest.spyOn(core, 'debug').mockImplementation((message: string): void => {
      debugMessages.push(message);
    });
    jest.spyOn(core, 'warning').mockImplementation((message: string | Error): void => {
      warningMessages.push(message instanceof Error ? message.toString() : message);
    });
    jest.spyOn(core, 'setFailed').mockImplementation((message: string | Error): void => {
      errorMessages.push(message instanceof Error ? message.toString() : message);
    });
  });

  beforeEach(() => {
    inputs = {};
    outputs = {};
    infoMessages = [];
    debugMessages = [];
    warningMessages = [];
    errorMessages = [];
    for (let key in defaultOutputs) {
      outputs[key] = defaultOutputs[key as keyof typeof defaultOutputs];
    }
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  it.each([
    ['booleanInput', 'true', true],
    ['booleanInput', 'True', true],
    ['booleanInput', 'TRUE', true],
    ['booleanInput', 'false', false],
    ['booleanInput', 'False', false],
    ['booleanInput', 'FALSE', false]
  ])('Return %s with the input of %s', (inputName, inputValue, expected) => {
    inputs[inputName] = inputValue;
    expect(getBooleanInput(inputName)).toEqual(expected);
  });

  it('Throw warning and TypeError when input in wrong format', async () => {
    inputs['booleanInput'] = 'wrongInput';
    expect(() => {
      getBooleanInput('booleanInput');
    }).toThrow(TypeError('Input does not meet YAML 1.2 "Core Schema" specification: booleanInput'));
    expect(debugMessages[0]).toEqual('[getBooleanInput.stringInput]: wrongInput');
    expect(warningMessages[0]).toEqual(
      'YAML 1.2 "Core Schema" specification: https://yaml.org/spec/1.2/spec.html#id2804923'
    );
  });
});
