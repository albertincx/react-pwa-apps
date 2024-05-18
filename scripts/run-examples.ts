import { execSync } from 'node:child_process'
import prompts from 'prompts'
import {
  blue,
  cyan,
  green,
  red,
  reset,
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
    name: 'generateSW',
    display: 'generateSW',
    color: green,
  },
  {
    name: 'injectManifest',
    display: 'injectManifest',
    color: blue,
  },
]

const FRAMEWORKS: Framework[] = [
  {
    name: 'react',
    color: cyan,
    dir: 'react-router',
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
    // const { framework, strategy, behavior, reloadSW, selfDestroying }: PromptResult = {};
    const framework = FRAMEWORKS[0];
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
