import React, { Component } from 'react'
import Accessible from './Accessible'
import Action from './Action'
import ActionIcon from './ActionIcon'
import './Device.css'


class Device extends Component {
  constructor (props) {
    super(props)
    this.state = {
      showInfo: false
    }
    this.toggleInfo = this.toggleInfo.bind(this)
  }

  actions (actions, type, device) {
    const status = type === 'done' ? 'PASS' : 'FAIL'

    return actions.map((action) => {
      if (action.results) {
        return (
          <Action
            key={action.title[status]}
            type={type}
            status={status}
            device={device}
            security={this.props.security}
            action={action}
            policy={this.props.policy}
            platform={this.props.platform}
            onExpandPolicyViolation={this.props.onExpandPolicyViolation}
          >
            <ul className='result-list'>
              {action.results.map(({ name }) => <li key={name}>{name}</li>)}
            </ul>
          </Action>
        )
      } else {
        return (
          <Action
            key={action.title[status]}
            status={status}
            security={this.props.security}
            device={device}
            type={type}
            action={action}
            policy={this.props.policy}
            platform={this.props.platform}
            onExpandPolicyViolation={this.props.onExpandPolicyViolation}
          />
        )
      }
    })
  }

  process (device) {
    let d = Object.assign({}, device)
    d.friendlyName = d.friendlyName || 'Unknown device'
    d.identifier = d.deviceName || d.hardwareSerial || (d.macAddresses || []).join(' ')

    return d
  }

  toggleInfo () {
    this.setState({
      showInfo: !this.state.showInfo
    })
  }

  render () {
    if (!this.props.stethoscopeVersion) return null

    const device = Object.assign({}, this.props, this.process(this.props))
    const { org, scanResult } = this.props

    let deviceInfo = null

    if (this.state.showInfo) {
      deviceInfo = (
        <div className='deviceInfo'>
          <dl className='device-info'>
            <dt>Type</dt><dd>{device.hardwareModel}&nbsp;</dd>
            <dt>Manufacturer</dt><dd>{device.platformName}&nbsp;</dd>
            <dt>Model</dt><dd>{device.hardwareModel}&nbsp;</dd>
            <dt>Platform</dt><dd>{device.platform}&nbsp;</dd>
            <dt>OS Version</dt><dd>{device.osVersion}&nbsp;</dd>
            <dt>Name</dt><dd>{device.deviceName}&nbsp;</dd>
            <dt>Serial</dt><dd>{device.hardwareSerial}&nbsp;</dd>
            <dt>UDID</dt><dd>{device.deviceId}&nbsp;</dd>
            <dt>Status</dt><dd>{scanResult.status}&nbsp;</dd>
          </dl>
        </div>
      )
    }

    let deviceClass = 'ok'

    if (scanResult.status !== 'PASS') {
      deviceClass = scanResult.status === 'NUDGE' ? 'warning' : 'critical'
    }

    return (
      <div className='device-wrapper'>
        <div className={`panel device ${deviceClass}`}>
          <header>
            <div className='device-name'>{device.friendlyName}</div>
            <div className='device-identifier'>{device.identifier}&nbsp;</div>
            <Accessible expanded={this.state.showInfo} label={`Toggle and review ${device.deviceRating} device information for ${device.friendlyName}`}>
              <a className={`device-info-toggle ${this.state.showInfo ? 'open' : 'closed'}`} onClick={this.toggleInfo}>&#9660;</a>
            </Accessible>
          </header>
          
          {deviceInfo}

          <h2> Medium Profile Checklist - Laptops </h2>

          <div className='action-list'>
            <ul>
              { this.actions(device.critical, 'critical', device) }
              { this.actions(device.suggested, 'suggested', device) }
              { this.actions(device.done, 'done', device) }
            </ul>
          </div>

          <div className='last-updated'>
            Last scan {this.props.lastScanTime} by {this.props.scannedBy}
          </div>

        </div>
      </div>
    )
  }
}

Device.defaultProps = {
  macAddresses: [],
  ipAddresses: [],
  critical: [],
  suggested: [],
  done: []
}

export default Device
