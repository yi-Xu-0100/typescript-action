import * as core from '@actions/core';

export function getBooleanInput(booleanInputName: string, options?: core.InputOptions): boolean {
  const trueValue = ['true', 'True', 'TRUE', 'yes', 'Yes', 'YES', 'y', 'Y', 'on', 'On', 'ON'];
  const falseValue = ['false', 'False', 'FALSE', 'no', 'No', 'NO', 'n', 'N', 'off', 'Off', 'OFF'];
  const stringInput = core.getInput(booleanInputName, options);
  core.debug('[DEBUG]: stringInput: ' + stringInput);
  if (trueValue.indexOf(stringInput) > -1) return true;
  if (falseValue.indexOf(stringInput) > -1) return false;
  core.warning(
    'Boolean Language-Independent Type for YAML™ Version 1.1: https://yaml.org/type/bool.html'
  );
  throw TypeError(`Wrong boolean input value of ${booleanInputName}`);
}

export async function run(): Promise<void> {
  core.info('[INFO]: Usage - https://github.com/yi-Xu-0100/typescript-action#readme');
  const booleanInput: boolean = getBooleanInput('booleanInput');
  core.setOutput('booleanOutput', booleanInput);
  core.info('[INFO]: Action successfully completed!');
}

/* istanbul ignore next */
if (require.main === module) {
  run().catch(err => {
    core.setFailed(`Action failed: ${err.message}`);
  });
}
