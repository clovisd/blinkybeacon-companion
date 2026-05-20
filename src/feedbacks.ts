import { combineRgb } from '@companion-module/base'
import type { CompanionFeedbackDefinitions } from '@companion-module/base'

export function getFeedbacks(self: { currentState: string; isOnline: boolean }): CompanionFeedbackDefinitions {
  return {
    beacon_connected: {
      name: 'Beacon connected (USB detected)',
      type: 'boolean',
      defaultStyle: {
        bgcolor: combineRgb(0, 180, 0),
        color: combineRgb(255, 255, 255),
      },
      options: [],
      callback: () => {
        return self.isOnline
      },
    },
    beacon_active: {
      name: 'Beacon active (spin or flash)',
      type: 'boolean',
      defaultStyle: {
        bgcolor: combineRgb(255, 165, 0),
        color: combineRgb(0, 0, 0),
      },
      options: [],
      callback: () => {
        return self.isOnline && (self.currentState === 'spin' || self.currentState === 'flash')
      },
    },
    beacon_spinning: {
      name: 'Beacon spinning',
      type: 'boolean',
      defaultStyle: {
        bgcolor: combineRgb(0, 200, 0),
        color: combineRgb(0, 0, 0),
      },
      options: [],
      callback: () => {
        return self.isOnline && self.currentState === 'spin'
      },
    },
    beacon_flashing: {
      name: 'Beacon flashing',
      type: 'boolean',
      defaultStyle: {
        bgcolor: combineRgb(220, 50, 50),
        color: combineRgb(255, 255, 255),
      },
      options: [],
      callback: () => {
        return self.isOnline && self.currentState === 'flash'
      },
    },
    beacon_idle: {
      name: 'Beacon idle',
      type: 'boolean',
      defaultStyle: {
        bgcolor: combineRgb(50, 50, 50),
        color: combineRgb(200, 200, 200),
      },
      options: [],
      callback: () => {
        return self.isOnline && self.currentState === 'idle'
      },
    },
  }
}
