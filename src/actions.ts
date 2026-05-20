import type { CompanionActionDefinitions } from '@companion-module/base'

export function getActions(self: { doPost: (path: string) => Promise<void> }): CompanionActionDefinitions {
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
