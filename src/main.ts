import { info, setOutput, setFailed } from '@actions/core';
import { getBooleanInput } from './utils';

export async function run(): Promise<void> {
  info('[INFO]: Usage - https://github.com/yi-Xu-0100/typescript-action#readme');
  const booleanInput: boolean = getBooleanInput('booleanInput');
  setOutput('booleanOutput', booleanInput);
  info('[INFO]: Action successfully completed!');
}

/* istanbul ignore next */
if (require.main === module) {
  run().catch(err => {
    setFailed(`Action failed: ${err.message}`);
  });
}
