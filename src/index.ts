import {
  InstanceBase,
  InstanceStatus,
  type InstanceTypes,
  type SomeCompanionConfigField,
} from '@companion-module/base'
import { type ModuleConfig, getConfigFields } from './config'
import { getActions } from './actions'
import { getFeedbacks } from './feedbacks'

interface BlinkyBeaconTypes extends InstanceTypes {
  config: ModuleConfig
  secrets: undefined
}

class BlinkyBeaconInstance extends InstanceBase<BlinkyBeaconTypes> {
  currentState = 'idle'
  private pollInterval: ReturnType<typeof setInterval> | null = null
  private baseUrl = 'http://localhost:1337'

  async init(config: BlinkyBeaconTypes['config'], _isFirstInit: boolean, _secrets: BlinkyBeaconTypes['secrets']): Promise<void> {
    this.baseUrl = `http://${config.host}:${config.port}`
    this.setActionDefinitions(getActions(this))
    this.setFeedbackDefinitions(getFeedbacks(this))
    this.startPolling()
  }

  async destroy(): Promise<void> {
    this.stopPolling()
  }

  async configUpdated(config: BlinkyBeaconTypes['config'], _secrets: BlinkyBeaconTypes['secrets']): Promise<void> {
    this.baseUrl = `http://${config.host}:${config.port}`
    this.startPolling()
  }

  getConfigFields(): SomeCompanionConfigField[] {
    return getConfigFields()
  }

  async doPost(path: string): Promise<void> {
    try {
      const res = await fetch(`${this.baseUrl}${path}`, { method: 'POST' })
      if (!res.ok) {
        this.log('warn', `POST ${path} returned ${res.status}`)
      }
    } catch (err) {
      this.log('error', `Failed to reach blinkybeacon-tray: ${err}`)
      this.updateStatus(InstanceStatus.ConnectionFailure)
    }
  }

  private async pollStatus(): Promise<void> {
    try {
      const res = await fetch(`${this.baseUrl}/status`)
      if (!res.ok) {
        this.updateStatus(InstanceStatus.UnknownError)
        return
      }
      const data = (await res.json()) as { state: string; connected: boolean }
      this.currentState = data.state
      this.updateStatus(data.connected ? InstanceStatus.Ok : InstanceStatus.Connecting)
    } catch (_) {
      this.updateStatus(InstanceStatus.ConnectionFailure)
    }
    this.checkAllFeedbacks()
  }

  private startPolling(): void {
    this.stopPolling()
    void this.pollStatus()
    this.pollInterval = setInterval(() => void this.pollStatus(), 2000)
  }

  private stopPolling(): void {
    if (this.pollInterval !== null) {
      clearInterval(this.pollInterval)
      this.pollInterval = null
    }
  }
}

export = BlinkyBeaconInstance
