import * as main from '../src/main';
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
let errorMessages: string[];

describe('main', () => {
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
    jest.spyOn(core, 'setFailed').mockImplementation((message: string | Error): void => {
      errorMessages.push(message instanceof Error ? message.toString() : message);
    });
  });
  beforeEach(() => {
    inputs = {};
    outputs = {};
    errorMessages = [];
    for (let key in defaultOutputs) {
      outputs[key] = defaultOutputs[key as keyof typeof defaultOutputs];
    }
  });
  afterAll(() => {
    jest.restoreAllMocks();
  });

  const testStringInputsAsOutputs = [
    {
      inputName: 'booleanInput',
      inputValue: undefined,
      outputName: 'booleanOutput',
      outputValue: true
    },
    {
      inputName: 'booleanInput',
      inputValue: 'false',
      outputName: 'booleanOutput',
      outputValue: false
    }
  ];
  testStringInputsAsOutputs.forEach(element => {
    it(
      `Set the output ${element.outputName} of ${element.outputValue}` +
        ` with the input ${element.inputName} of ${element.inputValue}`,
      async () => {
        inputs[element.inputName] = element.inputValue;
        await main.run();
        expect(outputs[element.outputName]).toEqual(element.outputValue);
      }
    );
  });
  it('Throw TypeError when input in wrong format', async () => {
    inputs['booleanInput'] = 'wrongInput';
    await expect(main.run()).rejects.toEqual(
      TypeError('Wrong boolean input value of booleanInput')
    );
  });
});
