# LANDD
***

## Description

A LAN device discovery app. Basically a NestJS wrapper around [arp](https://man7.org/linux/man-pages/man8/arp.8.html) with simple REST apis and event emitters.

## Requirements
- [arp](https://man7.org/linux/man-pages/man8/arp.8.html)
- [nmap](https://nmap.org/download) (Likely to remove dependency on nmap in future)

## REST Endpoints

GET /device
```
```

PATCH /device/:macAddress
```
```

## Events

This app provides 2 types of event: 
- `Device Connect`: Triggers when device connects to the network.
- `Device Disconnect`: Triggers when device disconnects from the network.

