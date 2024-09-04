# LANDD
***

## Description

A LAN device discovery app. Basically a NestJS wrapper around [arp](https://man7.org/linux/man-pages/man8/arp.8.html) with simple REST apis and event emitters.

## Requirements
- [arp](https://man7.org/linux/man-pages/man8/arp.8.html)
- [nmap](https://nmap.org/download) (Likely to remove dependency on nmap in future)

## REST Endpoints

### GET /device
Get devices.
#### Parameter
* `?online=`: boolean
* `?macAddress_in=`: String array separated by `,`. e.g. `61:d7:3d:c4:4d:95,db:73:5f:13:14:05`
#### Example Response
* Status: 200
* Content-Type: "application/json"
```json
[
    {
        "macAddress": "61:d7:3d:c4:4d:95",
        "name": null,
        "ip": "192.168.1.2",
        "online": true,
    },
    {
        "macAddress": "db:73:5f:13:14:05",
        "name": null,
        "ip": "192.168.1.3",
        "online": false,
    },
]
```

### PATCH /device/:macAddress
Patch the name of device.
#### Payload
* Content-Type: "application/json"
```json
{
    "name": "My new iPhone",
}
```
#### Example Response
* Status: 200
* Content-Type: "application/json"
```json
{
    "macAddress": "61:d7:3d:c4:4d:95",
    "name": "My new iPhone",
    "ip": "192.168.1.2",
    "online": true,
}
```

## Events

This app provides 2 types of event: 
- `Device Connect`: Triggers when device connects to the network.
- `Device Disconnect`: Triggers when device disconnects from the network.

You can overwrite the listener functions with custom event handler logic [here](https://github.com/Phoenix-Chen/LANDD/blob/master/src/listeners/device-event.listener.ts). The event payload represents single device in the format of:
```json
{
    "macAddress": "61:d7:3d:c4:4d:95",
    "name": "My new iPhone",
    "ip": "192.168.1.2",
    "online": true,
}
```

