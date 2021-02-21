import * as core from '@actions/core';

export function getBooleanInput(booleanInputName: string, options?: core.InputOptions): boolean {
  const trueValue = ['true', 'True', 'TRUE', 'yes', 'Yes', 'YES', 'y', 'Y', 'on', 'On', 'ON'];
  const falseValue = ['false', 'False', 'FALSE', 'no', 'No', 'NO', 'n', 'N', 'off', 'Off', 'OFF'];
  const stringInput = core.getInput(booleanInputName, options);
  if (trueValue.indexOf(stringInput) > -1) return true;
  if (falseValue.indexOf(stringInput) > -1) return false;
  throw TypeError(`Wrong boolean input value of ${booleanInputName}`);
}

export async function run(): Promise<void> {
  const booleanInput: boolean = getBooleanInput('booleanInput');
  core.setOutput('booleanOutput', booleanInput);
}

/* istanbul ignore next */
if (require.main === module) {
  core.info('[INFO]: Usage https://github.com/yi-Xu-0100/typescript-action#readme');
  run().catch(err => {
    core.setFailed(`Action failed: ${err.message}`);
  });
}
