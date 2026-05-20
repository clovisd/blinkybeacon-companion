import type { CompanionActionDefinitions, InstanceBase } from '@companion-module/base'
import type { ModuleConfig } from './config'

export function getActions(
  self: InstanceBase<any> & { doPost: (path: string) => Promise<void> }
): CompanionActionDefinitions {
  return {
    spin: {
      name: 'Spin beacon',
      options: [],
      callback: async () => {
        await self.doPost('/spin')
      },
    },
    flash: {
      name: 'Flash beacon',
      options: [],
      callback: async () => {
        await self.doPost('/flash')
      },
    },
    stop: {
      name: 'Stop beacon',
      options: [],
      callback: async () => {
        await self.doPost('/stop')
      },
    },
  }
}
