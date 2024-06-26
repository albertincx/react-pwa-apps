import { execSync } from 'node:child_process'
import {
  blue,
  green,
} from 'kolorist'

type Color = (str: string | number) => string

interface Behavior {
  name: string
  display: string
  color: Color
}

interface Strategy {
  name: string
  display: string
  color: Color
}

interface Framework {
  name: string
  color: Color
  dir: string
}

const BEHAVIORS: Behavior[] = [
  {
    name: 'prompt',
    display: 'Prompt for update',
    color: green,
  },
  {
    name: 'claims',
    display: 'Auto update',
    color: blue,
  },
]

const STRATEGIES: Strategy[] = [
  {
    name: 'injectManifest',
    display: 'injectManifest',
    color: blue,
  },
  {
    name: 'generateSW',
    display: 'generateSW',
    color: green,
  },
]

interface PromptResult {
  framework: Framework
  strategy: Strategy
  behavior: Behavior
  reloadSW: boolean
  selfDestroying: boolean
}

async function init() {
  try {
    const framework = { dir: process.argv[2] };
    const strategy = STRATEGIES[0];
    const behavior = BEHAVIORS[0];
    const reloadSW = false;
    const selfDestroying = false;
    let script = ''
    if (strategy.name === 'injectManifest')
      script = '-sw'

    switch (behavior.name) {
      case 'prompt':
        break
      case 'claims':
      default:
        script += '-claims'
        break
    }

    if (reloadSW)
      script += '-reloadsw'

    if (selfDestroying)
      script += '-destroy'

    execSync(`pnpm run start${script}`, {
      stdio: 'inherit',
      cwd: `examples/${framework.dir}`,
    })
  }
  catch (cancelled: any) {
    console.log(cancelled.message)
  }
}

init().catch((e) => {
  console.error(e)
})
