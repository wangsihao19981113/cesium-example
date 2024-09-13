import {TyphoonRoute,TyphoonPoint,TyphoonDatasource,TyphoonRouteForecast} from './index.d'
import { cloneDeep, merge, uniqWith } from 'lodash-es'
import * as Cesium from 'cesium'
import {Interval} from "cesium";
const colorDict = {
    '热带低压(TD)': '#30fc31',
    '热带风暴(TS)': '#307efa',
    '强热带风暴(STS)': '#fffc00',
    '台风(TY)': '#ff9c00',
    '强台风(STY)': '#fb7cff',
    '超强台风(SuperTY)': '#fa3030'
}

const forcColorDict = {
    "中国香港": '#f5000e',
    "日本": '#0000ff',
    "中央": '#ff0000',
    "美国": '#000000',
    "韩国": '#41c1f6',
    "广州": '#ede12c',
    "上海": '#cdf3dd',
    "福州": '#c7c7c7',
    "新德里": '#345cdc',
    "乌兰巴托": '#12a3dd',
    "莫斯科": '#4fea03',
    "河内": '#41c1fd',
    "曼谷": '#ddc1f6',
    "英国": '#E1DB1A'
}

const json = [{
    "tfbh": "202209",
    "ident": "202209",
    "name": "马鞍",
    "ename": "MA-ON",
    "is_current": 1,
    "begin_time": "2022-08-22T11:00:00",
    "end_time": "2022-08-24T18:00:00",
    "land": [],
    "points": [
        {
            "time": "2022-08-21T14:00:00",
            "lng": 127.3,
            "lat": 17.2,
            "strong": "热带低压(TD)",
            "power": 7,
            "speed": 15,
            "move_dir": "西西南",
            "move_speed": 12,
            "pressure": 1000,
            "radius7": 0,
            "radius10": 0,
            "radius12": 0,
            "radius7_quad": {
                "ne": 0,
                "se": 0,
                "sw": 0,
                "nw": 0
            },
            "radius10_quad": {
                "ne": 0,
                "se": 0,
                "sw": 0,
                "nw": 0
            },
            "radius12_quad": {
                "ne": 0,
                "se": 0,
                "sw": 0,
                "nw": 0
            },
            "remark": "",
            "forecast": null
        },
        {
            "time": "2022-08-21T17:00:00",
            "lng": 126.8,
            "lat": 17,
            "strong": "热带低压(TD)",
            "power": 7,
            "speed": 15,
            "move_dir": "西西南",
            "move_speed": 12,
            "pressure": 1000,
            "radius7": 0,
            "radius10": 0,
            "radius12": 0,
            "radius7_quad": {
                "ne": 0,
                "se": 0,
                "sw": 0,
                "nw": 0
            },
            "radius10_quad": {
                "ne": 0,
                "se": 0,
                "sw": 0,
                "nw": 0
            },
            "radius12_quad": {
                "ne": 0,
                "se": 0,
                "sw": 0,
                "nw": 0
            },
            "remark": "",
            "forecast": null
        },
        {
            "time": "2022-08-21T20:00:00",
            "lng": 126.7,
            "lat": 16.9,
            "strong": "热带低压(TD)",
            "power": 7,
            "speed": 15,
            "move_dir": "西西南",
            "move_speed": 12,
            "pressure": 1000,
            "radius7": 0,
            "radius10": 0,
            "radius12": 0,
            "radius7_quad": {
                "ne": 0,
                "se": 0,
                "sw": 0,
                "nw": 0
            },
            "radius10_quad": {
                "ne": 0,
                "se": 0,
                "sw": 0,
                "nw": 0
            },
            "radius12_quad": {
                "ne": 0,
                "se": 0,
                "sw": 0,
                "nw": 0
            },
            "remark": "",
            "forecast": null
        },
        {
            "time": "2022-08-21T23:00:00",
            "lng": 126.4,
            "lat": 16.9,
            "strong": "热带低压(TD)",
            "power": 7,
            "speed": 15,
            "move_dir": "西西南",
            "move_speed": 11,
            "pressure": 1000,
            "radius7": 0,
            "radius10": 0,
            "radius12": 0,
            "radius7_quad": {
                "ne": 0,
                "se": 0,
                "sw": 0,
                "nw": 0
            },
            "radius10_quad": {
                "ne": 0,
                "se": 0,
                "sw": 0,
                "nw": 0
            },
            "radius12_quad": {
                "ne": 0,
                "se": 0,
                "sw": 0,
                "nw": 0
            },
            "remark": "",
            "forecast": null
        },
        {
            "time": "2022-08-22T02:00:00",
            "lng": 125.7,
            "lat": 17,
            "strong": "热带低压(TD)",
            "power": 7,
            "speed": 15,
            "move_dir": "西",
            "move_speed": 11,
            "pressure": 1000,
            "radius7": 0,
            "radius10": 0,
            "radius12": 0,
            "radius7_quad": {
                "ne": 0,
                "se": 0,
                "sw": 0,
                "nw": 0
            },
            "radius10_quad": {
                "ne": 0,
                "se": 0,
                "sw": 0,
                "nw": 0
            },
            "radius12_quad": {
                "ne": 0,
                "se": 0,
                "sw": 0,
                "nw": 0
            },
            "remark": "",
            "forecast": null
        },
        {
            "time": "2022-08-22T05:00:00",
            "lng": 124.9,
            "lat": 16.6,
            "strong": "热带低压(TD)",
            "power": 7,
            "speed": 15,
            "move_dir": "西西北",
            "move_speed": 8,
            "pressure": 1000,
            "radius7": 0,
            "radius10": 0,
            "radius12": 0,
            "radius7_quad": {
                "ne": 0,
                "se": 0,
                "sw": 0,
                "nw": 0
            },
            "radius10_quad": {
                "ne": 0,
                "se": 0,
                "sw": 0,
                "nw": 0
            },
            "radius12_quad": {
                "ne": 0,
                "se": 0,
                "sw": 0,
                "nw": 0
            },
            "remark": "",
            "forecast": null
        },
        {
            "time": "2022-08-22T08:00:00",
            "lng": 124.5,
            "lat": 16.3,
            "strong": "热带低压(TD)",
            "power": 7,
            "speed": 15,
            "move_dir": "西北",
            "move_speed": 8,
            "pressure": 1000,
            "radius7": 0,
            "radius10": 0,
            "radius12": 0,
            "radius7_quad": {
                "ne": 0,
                "se": 0,
                "sw": 0,
                "nw": 0
            },
            "radius10_quad": {
                "ne": 0,
                "se": 0,
                "sw": 0,
                "nw": 0
            },
            "radius12_quad": {
                "ne": 0,
                "se": 0,
                "sw": 0,
                "nw": 0
            },
            "remark": "",
            "forecast": null
        },
        {
            "time": "2022-08-22T11:00:00",
            "lng": 124.1,
            "lat": 16.3,
            "strong": "热带风暴(TS)",
            "power": 8,
            "speed": 18,
            "move_dir": "北西北",
            "move_speed": 6,
            "pressure": 998,
            "radius7": 200,
            "radius10": 0,
            "radius12": 0,
            "radius7_quad": {
                "ne": 200,
                "se": 200,
                "sw": 200,
                "nw": 160
            },
            "radius10_quad": {
                "ne": 0,
                "se": 0,
                "sw": 0,
                "nw": 0
            },
            "radius12_quad": {
                "ne": 0,
                "se": 0,
                "sw": 0,
                "nw": 0
            },
            "remark": "",
            "forecast": null
        },
        {
            "time": "2022-08-22T14:00:00",
            "lng": 123.7,
            "lat": 16.3,
            "strong": "热带风暴(TS)",
            "power": 8,
            "speed": 18,
            "move_dir": "西北",
            "move_speed": 6,
            "pressure": 998,
            "radius7": 200,
            "radius10": 0,
            "radius12": 0,
            "radius7_quad": {
                "ne": 200,
                "se": 200,
                "sw": 200,
                "nw": 160
            },
            "radius10_quad": {
                "ne": 0,
                "se": 0,
                "sw": 0,
                "nw": 0
            },
            "radius12_quad": {
                "ne": 0,
                "se": 0,
                "sw": 0,
                "nw": 0
            },
            "remark": "",
            "forecast": null
        },
        {
            "time": "2022-08-22T17:00:00",
            "lng": 123.5,
            "lat": 16.2,
            "strong": "热带风暴(TS)",
            "power": 8,
            "speed": 20,
            "move_dir": "西北",
            "move_speed": 8,
            "pressure": 995,
            "radius7": 200,
            "radius10": 0,
            "radius12": 0,
            "radius7_quad": {
                "ne": 200,
                "se": 200,
                "sw": 200,
                "nw": 160
            },
            "radius10_quad": {
                "ne": 0,
                "se": 0,
                "sw": 0,
                "nw": 0
            },
            "radius12_quad": {
                "ne": 0,
                "se": 0,
                "sw": 0,
                "nw": 0
            },
            "remark": "",
            "forecast": null
        },
        {
            "time": "2022-08-22T20:00:00",
            "lng": 123.5,
            "lat": 16.1,
            "strong": "热带风暴(TS)",
            "power": 8,
            "speed": 20,
            "move_dir": "西北",
            "move_speed": 13,
            "pressure": 995,
            "radius7": 200,
            "radius10": 0,
            "radius12": 0,
            "radius7_quad": {
                "ne": 200,
                "se": 200,
                "sw": 200,
                "nw": 160
            },
            "radius10_quad": {
                "ne": 0,
                "se": 0,
                "sw": 0,
                "nw": 0
            },
            "radius12_quad": {
                "ne": 0,
                "se": 0,
                "sw": 0,
                "nw": 0
            },
            "remark": "",
            "forecast": []
        },
        {
            "time": "2022-08-22T23:00:00",
            "lng": 123.5,
            "lat": 16.1,
            "strong": "热带风暴(TS)",
            "power": 8,
            "speed": 20,
            "move_dir": "西北",
            "move_speed": 17,
            "pressure": 995,
            "radius7": 200,
            "radius10": 0,
            "radius12": 0,
            "radius7_quad": {
                "ne": 200,
                "se": 200,
                "sw": 200,
                "nw": 160
            },
            "radius10_quad": {
                "ne": 0,
                "se": 0,
                "sw": 0,
                "nw": 0
            },
            "radius12_quad": {
                "ne": 0,
                "se": 0,
                "sw": 0,
                "nw": 0
            },
            "remark": "",
            "forecast": []
        },
        {
            "time": "2022-08-23T02:00:00",
            "lng": 123.4,
            "lat": 16.1,
            "strong": "热带风暴(TS)",
            "power": 9,
            "speed": 23,
            "move_dir": "北西北",
            "move_speed": 22,
            "pressure": 990,
            "radius7": 240,
            "radius10": 0,
            "radius12": 0,
            "radius7_quad": {
                "ne": 240,
                "se": 240,
                "sw": 200,
                "nw": 180
            },
            "radius10_quad": {
                "ne": 0,
                "se": 0,
                "sw": 0,
                "nw": 0
            },
            "radius12_quad": {
                "ne": 0,
                "se": 0,
                "sw": 0,
                "nw": 0
            },
            "remark": "",
            "forecast": []
        },
        {
            "time": "2022-08-23T05:00:00",
            "lng": 123.2,
            "lat": 16.5,
            "strong": "热带风暴(TS)",
            "power": 9,
            "speed": 23,
            "move_dir": "西北",
            "move_speed": 24,
            "pressure": 990,
            "radius7": 240,
            "radius10": 0,
            "radius12": 0,
            "radius7_quad": {
                "ne": 240,
                "se": 240,
                "sw": 200,
                "nw": 180
            },
            "radius10_quad": {
                "ne": 0,
                "se": 0,
                "sw": 0,
                "nw": 0
            },
            "radius12_quad": {
                "ne": 0,
                "se": 0,
                "sw": 0,
                "nw": 0
            },
            "remark": "",
            "forecast": []
        },
        {
            "time": "2022-08-23T08:00:00",
            "lng": 123,
            "lat": 17,
            "strong": "强热带风暴(STS)",
            "power": 10,
            "speed": 25,
            "move_dir": "西北",
            "move_speed": 25,
            "pressure": 985,
            "radius7": 240,
            "radius10": 0,
            "radius12": 0,
            "radius7_quad": {
                "ne": 240,
                "se": 240,
                "sw": 200,
                "nw": 180
            },
            "radius10_quad": {
                "ne": 0,
                "se": 0,
                "sw": 0,
                "nw": 0
            },
            "radius12_quad": {
                "ne": 0,
                "se": 0,
                "sw": 0,
                "nw": 0
            },
            "remark": "",
            "forecast": []
        },
        {
            "time": "2022-08-23T11:00:00",
            "lng": 122.4,
            "lat": 17.5,
            "strong": "强热带风暴(STS)",
            "power": 10,
            "speed": 28,
            "move_dir": "西北",
            "move_speed": 23,
            "pressure": 982,
            "radius7": 240,
            "radius10": 80,
            "radius12": 0,
            "radius7_quad": {
                "ne": 240,
                "se": 240,
                "sw": 200,
                "nw": 200
            },
            "radius10_quad": {
                "ne": 80,
                "se": 80,
                "sw": 80,
                "nw": 80
            },
            "radius12_quad": {
                "ne": 0,
                "se": 0,
                "sw": 0,
                "nw": 0
            },
            "remark": "",
            "forecast": []
        },
        {
            "time": "2022-08-23T14:00:00",
            "lng": 121.6,
            "lat": 17.9,
            "strong": "强热带风暴(STS)",
            "power": 10,
            "speed": 25,
            "move_dir": "西西北",
            "move_speed": 23,
            "pressure": 985,
            "radius7": 0,
            "radius10": 0,
            "radius12": 0,
            "radius7_quad": {
                "ne": 0,
                "se": 0,
                "sw": 0,
                "nw": 0
            },
            "radius10_quad": {
                "ne": 0,
                "se": 0,
                "sw": 0,
                "nw": 0
            },
            "radius12_quad": {
                "ne": 0,
                "se": 0,
                "sw": 0,
                "nw": 0
            },
            "remark": "",
            "forecast": []
        },
        {
            "time": "2022-08-23T17:00:00",
            "lng": 121.1,
            "lat": 18.2,
            "strong": "强热带风暴(STS)",
            "power": 10,
            "speed": 25,
            "move_dir": "西西北",
            "move_speed": 24,
            "pressure": 985,
            "radius7": 240,
            "radius10": 0,
            "radius12": 0,
            "radius7_quad": {
                "ne": 240,
                "se": 240,
                "sw": 200,
                "nw": 200
            },
            "radius10_quad": {
                "ne": 0,
                "se": 0,
                "sw": 0,
                "nw": 0
            },
            "radius12_quad": {
                "ne": 0,
                "se": 0,
                "sw": 0,
                "nw": 0
            },
            "remark": "",
            "forecast": []
        },
        {
            "time": "2022-08-23T20:00:00",
            "lng": 120.7,
            "lat": 18.4,
            "strong": "强热带风暴(STS)",
            "power": 10,
            "speed": 25,
            "move_dir": "西西北",
            "move_speed": 24,
            "pressure": 985,
            "radius7": 240,
            "radius10": 0,
            "radius12": 0,
            "radius7_quad": {
                "ne": 240,
                "se": 240,
                "sw": 200,
                "nw": 200
            },
            "radius10_quad": {
                "ne": 0,
                "se": 0,
                "sw": 0,
                "nw": 0
            },
            "radius12_quad": {
                "ne": 0,
                "se": 0,
                "sw": 0,
                "nw": 0
            },
            "remark": "",
            "forecast": []
        },
        {
            "time": "2022-08-23T23:00:00",
            "lng": 120,
            "lat": 18.7,
            "strong": "强热带风暴(STS)",
            "power": 10,
            "speed": 25,
            "move_dir": "西西北",
            "move_speed": 20,
            "pressure": 985,
            "radius7": 240,
            "radius10": 0,
            "radius12": 0,
            "radius7_quad": {
                "ne": 240,
                "se": 240,
                "sw": 200,
                "nw": 200
            },
            "radius10_quad": {
                "ne": 0,
                "se": 0,
                "sw": 0,
                "nw": 0
            },
            "radius12_quad": {
                "ne": 0,
                "se": 0,
                "sw": 0,
                "nw": 0
            },
            "remark": "",
            "forecast": []
        },
        {
            "time": "2022-08-24T00:00:00",
            "lng": 119.7,
            "lat": 18.8,
            "strong": "强热带风暴(STS)",
            "power": 10,
            "speed": 25,
            "move_dir": "西西北",
            "move_speed": 20,
            "pressure": 985,
            "radius7": 240,
            "radius10": 0,
            "radius12": 0,
            "radius7_quad": {
                "ne": 240,
                "se": 240,
                "sw": 200,
                "nw": 200
            },
            "radius10_quad": {
                "ne": 0,
                "se": 0,
                "sw": 0,
                "nw": 0
            },
            "radius12_quad": {
                "ne": 0,
                "se": 0,
                "sw": 0,
                "nw": 0
            },
            "remark": "",
            "forecast": []
        },
        {
            "time": "2022-08-24T01:00:00",
            "lng": 119.6,
            "lat": 18.8,
            "strong": "强热带风暴(STS)",
            "power": 10,
            "speed": 25,
            "move_dir": "西西北",
            "move_speed": 20,
            "pressure": 985,
            "radius7": 240,
            "radius10": 0,
            "radius12": 0,
            "radius7_quad": {
                "ne": 240,
                "se": 240,
                "sw": 200,
                "nw": 200
            },
            "radius10_quad": {
                "ne": 0,
                "se": 0,
                "sw": 0,
                "nw": 0
            },
            "radius12_quad": {
                "ne": 0,
                "se": 0,
                "sw": 0,
                "nw": 0
            },
            "remark": "",
            "forecast": []
        },
        {
            "time": "2022-08-24T02:00:00",
            "lng": 119.3,
            "lat": 19,
            "strong": "强热带风暴(STS)",
            "power": 10,
            "speed": 25,
            "move_dir": "西西北",
            "move_speed": 23,
            "pressure": 985,
            "radius7": 240,
            "radius10": 0,
            "radius12": 0,
            "radius7_quad": {
                "ne": 240,
                "se": 240,
                "sw": 200,
                "nw": 200
            },
            "radius10_quad": {
                "ne": 0,
                "se": 0,
                "sw": 0,
                "nw": 0
            },
            "radius12_quad": {
                "ne": 0,
                "se": 0,
                "sw": 0,
                "nw": 0
            },
            "remark": "",
            "forecast": []
        },
        {
            "time": "2022-08-24T03:00:00",
            "lng": 119,
            "lat": 19.1,
            "strong": "强热带风暴(STS)",
            "power": 10,
            "speed": 25,
            "move_dir": "西西北",
            "move_speed": 23,
            "pressure": 985,
            "radius7": 240,
            "radius10": 0,
            "radius12": 0,
            "radius7_quad": {
                "ne": 240,
                "se": 240,
                "sw": 200,
                "nw": 200
            },
            "radius10_quad": {
                "ne": 0,
                "se": 0,
                "sw": 0,
                "nw": 0
            },
            "radius12_quad": {
                "ne": 0,
                "se": 0,
                "sw": 0,
                "nw": 0
            },
            "remark": "",
            "forecast": []
        },
        {
            "time": "2022-08-24T04:00:00",
            "lng": 118.6,
            "lat": 19.2,
            "strong": "强热带风暴(STS)",
            "power": 10,
            "speed": 25,
            "move_dir": "西西北",
            "move_speed": 23,
            "pressure": 985,
            "radius7": 240,
            "radius10": 0,
            "radius12": 0,
            "radius7_quad": {
                "ne": 240,
                "se": 240,
                "sw": 200,
                "nw": 200
            },
            "radius10_quad": {
                "ne": 0,
                "se": 0,
                "sw": 0,
                "nw": 0
            },
            "radius12_quad": {
                "ne": 0,
                "se": 0,
                "sw": 0,
                "nw": 0
            },
            "remark": "",
            "forecast": []
        },
        {
            "time": "2022-08-24T05:00:00",
            "lng": 118.1,
            "lat": 19.2,
            "strong": "强热带风暴(STS)",
            "power": 10,
            "speed": 25,
            "move_dir": "西西北",
            "move_speed": 25,
            "pressure": 985,
            "radius7": 240,
            "radius10": 0,
            "radius12": 0,
            "radius7_quad": {
                "ne": 240,
                "se": 240,
                "sw": 200,
                "nw": 200
            },
            "radius10_quad": {
                "ne": 0,
                "se": 0,
                "sw": 0,
                "nw": 0
            },
            "radius12_quad": {
                "ne": 0,
                "se": 0,
                "sw": 0,
                "nw": 0
            },
            "remark": "",
            "forecast": []
        },
        {
            "time": "2022-08-24T06:00:00",
            "lng": 117.8,
            "lat": 19.2,
            "strong": "强热带风暴(STS)",
            "power": 10,
            "speed": 25,
            "move_dir": "西西北",
            "move_speed": 25,
            "pressure": 985,
            "radius7": 240,
            "radius10": 0,
            "radius12": 0,
            "radius7_quad": {
                "ne": 240,
                "se": 240,
                "sw": 200,
                "nw": 200
            },
            "radius10_quad": {
                "ne": 0,
                "se": 0,
                "sw": 0,
                "nw": 0
            },
            "radius12_quad": {
                "ne": 0,
                "se": 0,
                "sw": 0,
                "nw": 0
            },
            "remark": "",
            "forecast": []
        },
        {
            "time": "2022-08-24T07:00:00",
            "lng": 117.5,
            "lat": 19.3,
            "strong": "强热带风暴(STS)",
            "power": 10,
            "speed": 25,
            "move_dir": "西西北",
            "move_speed": 25,
            "pressure": 985,
            "radius7": 240,
            "radius10": 0,
            "radius12": 0,
            "radius7_quad": {
                "ne": 240,
                "se": 240,
                "sw": 200,
                "nw": 200
            },
            "radius10_quad": {
                "ne": 0,
                "se": 0,
                "sw": 0,
                "nw": 0
            },
            "radius12_quad": {
                "ne": 0,
                "se": 0,
                "sw": 0,
                "nw": 0
            },
            "remark": "",
            "forecast": []
        },
        {
            "time": "2022-08-24T08:00:00",
            "lng": 117.4,
            "lat": 19.4,
            "strong": "强热带风暴(STS)",
            "power": 10,
            "speed": 28,
            "move_dir": "西西北",
            "move_speed": 24,
            "pressure": 982,
            "radius7": 240,
            "radius10": 120,
            "radius12": 0,
            "radius7_quad": {
                "ne": 240,
                "se": 240,
                "sw": 200,
                "nw": 200
            },
            "radius10_quad": {
                "ne": 100,
                "se": 120,
                "sw": 100,
                "nw": 100
            },
            "radius12_quad": {
                "ne": 0,
                "se": 0,
                "sw": 0,
                "nw": 0
            },
            "remark": "",
            "forecast": [
                {
                    "sets": "美国",
                    "points": [
                        {
                            "time": "2022-08-24T20:00:00",
                            "lng": 114.9,
                            "lat": 20.3,
                            "strong": "强热带风暴(STS)",
                            "power": 11,
                            "speed": 31,
                            "move_dir": null,
                            "move_speed": null,
                            "pressure": 0,
                            "radius7": null,
                            "radius10": null,
                            "remark": null
                        },
                        {
                            "time": "2022-08-25T08:00:00",
                            "lng": 112,
                            "lat": 21.3,
                            "strong": "强热带风暴(STS)",
                            "power": 11,
                            "speed": 31,
                            "move_dir": null,
                            "move_speed": null,
                            "pressure": 0,
                            "radius7": null,
                            "radius10": null,
                            "remark": null
                        },
                        {
                            "time": "2022-08-25T20:00:00",
                            "lng": 108.7,
                            "lat": 22.1,
                            "strong": "热带风暴(TS)",
                            "power": 9,
                            "speed": 23,
                            "move_dir": null,
                            "move_speed": null,
                            "pressure": 0,
                            "radius7": null,
                            "radius10": null,
                            "remark": null
                        },
                        {
                            "time": "2022-08-26T08:00:00",
                            "lng": 105.3,
                            "lat": 22.6,
                            "strong": "热带低压(TD)",
                            "power": 7,
                            "speed": 15,
                            "move_dir": null,
                            "move_speed": null,
                            "pressure": 0,
                            "radius7": null,
                            "radius10": null,
                            "remark": null
                        }
                    ]
                }
            ]
        },
        {
            "time": "2022-08-24T09:00:00",
            "lng": 117.2,
            "lat": 19.5,
            "strong": "强热带风暴(STS)",
            "power": 10,
            "speed": 28,
            "move_dir": "西西北",
            "move_speed": 22,
            "pressure": 982,
            "radius7": 240,
            "radius10": 120,
            "radius12": 0,
            "radius7_quad": {
                "ne": 240,
                "se": 240,
                "sw": 200,
                "nw": 200
            },
            "radius10_quad": {
                "ne": 100,
                "se": 120,
                "sw": 100,
                "nw": 100
            },
            "radius12_quad": {
                "ne": 0,
                "se": 0,
                "sw": 0,
                "nw": 0
            },
            "remark": "",
            "forecast": []
        },
        {
            "time": "2022-08-24T10:00:00",
            "lng": 117.1,
            "lat": 19.5,
            "strong": "强热带风暴(STS)",
            "power": 10,
            "speed": 28,
            "move_dir": "西西北",
            "move_speed": 21,
            "pressure": 982,
            "radius7": 240,
            "radius10": 120,
            "radius12": 0,
            "radius7_quad": {
                "ne": 240,
                "se": 240,
                "sw": 200,
                "nw": 200
            },
            "radius10_quad": {
                "ne": 100,
                "se": 120,
                "sw": 100,
                "nw": 100
            },
            "radius12_quad": {
                "ne": 0,
                "se": 0,
                "sw": 0,
                "nw": 0
            },
            "remark": "",
            "forecast": []
        },
        {
            "time": "2022-08-24T11:00:00",
            "lng": 117.1,
            "lat": 19.5,
            "strong": "强热带风暴(STS)",
            "power": 11,
            "speed": 30,
            "move_dir": "西西北",
            "move_speed": 27,
            "pressure": 980,
            "radius7": 240,
            "radius10": 120,
            "radius12": 0,
            "radius7_quad": {
                "ne": 240,
                "se": 240,
                "sw": 200,
                "nw": 200
            },
            "radius10_quad": {
                "ne": 100,
                "se": 120,
                "sw": 100,
                "nw": 100
            },
            "radius12_quad": {
                "ne": 0,
                "se": 0,
                "sw": 0,
                "nw": 0
            },
            "remark": "",
            "forecast": []
        },
        {
            "time": "2022-08-24T12:00:00",
            "lng": 117.1,
            "lat": 19.5,
            "strong": "强热带风暴(STS)",
            "power": 11,
            "speed": 30,
            "move_dir": "西西北",
            "move_speed": 27,
            "pressure": 980,
            "radius7": 240,
            "radius10": 120,
            "radius12": 0,
            "radius7_quad": {
                "ne": 240,
                "se": 240,
                "sw": 200,
                "nw": 200
            },
            "radius10_quad": {
                "ne": 100,
                "se": 120,
                "sw": 100,
                "nw": 100
            },
            "radius12_quad": {
                "ne": 0,
                "se": 0,
                "sw": 0,
                "nw": 0
            },
            "remark": "",
            "forecast": []
        },
        {
            "time": "2022-08-24T13:00:00",
            "lng": 116.9,
            "lat": 19.5,
            "strong": "强热带风暴(STS)",
            "power": 11,
            "speed": 30,
            "move_dir": "西西北",
            "move_speed": 27,
            "pressure": 980,
            "radius7": 240,
            "radius10": 120,
            "radius12": 0,
            "radius7_quad": {
                "ne": 240,
                "se": 240,
                "sw": 200,
                "nw": 200
            },
            "radius10_quad": {
                "ne": 100,
                "se": 120,
                "sw": 100,
                "nw": 100
            },
            "radius12_quad": {
                "ne": 0,
                "se": 0,
                "sw": 0,
                "nw": 0
            },
            "remark": "",
            "forecast": []
        },
        {
            "time": "2022-08-24T14:00:00",
            "lng": 116.6,
            "lat": 19.6,
            "strong": "强热带风暴(STS)",
            "power": 11,
            "speed": 30,
            "move_dir": "西西北",
            "move_speed": 28,
            "pressure": 980,
            "radius7": 240,
            "radius10": 120,
            "radius12": 0,
            "radius7_quad": {
                "ne": 240,
                "se": 240,
                "sw": 200,
                "nw": 200
            },
            "radius10_quad": {
                "ne": 100,
                "se": 120,
                "sw": 100,
                "nw": 100
            },
            "radius12_quad": {
                "ne": 0,
                "se": 0,
                "sw": 0,
                "nw": 0
            },
            "remark": "",
            "forecast": []
        },
        {
            "time": "2022-08-24T15:00:00",
            "lng": 116.4,
            "lat": 19.8,
            "strong": "强热带风暴(STS)",
            "power": 11,
            "speed": 30,
            "move_dir": "西西北",
            "move_speed": 28,
            "pressure": 980,
            "radius7": 240,
            "radius10": 120,
            "radius12": 0,
            "radius7_quad": {
                "ne": 240,
                "se": 240,
                "sw": 200,
                "nw": 200
            },
            "radius10_quad": {
                "ne": 100,
                "se": 120,
                "sw": 100,
                "nw": 100
            },
            "radius12_quad": {
                "ne": 0,
                "se": 0,
                "sw": 0,
                "nw": 0
            },
            "remark": "",
            "forecast": []
        },
        {
            "time": "2022-08-24T16:00:00",
            "lng": 116.1,
            "lat": 19.9,
            "strong": "强热带风暴(STS)",
            "power": 11,
            "speed": 30,
            "move_dir": "西西北",
            "move_speed": 28,
            "pressure": 980,
            "radius7": 240,
            "radius10": 120,
            "radius12": null,
            "radius7_quad": {
                "ne": 240,
                "se": 240,
                "sw": 200,
                "nw": 200
            },
            "radius10_quad": {
                "ne": 100,
                "se": 120,
                "sw": 100,
                "nw": 100
            },
            "radius12_quad": {
                "ne": null,
                "se": null,
                "sw": null,
                "nw": null
            },
            "remark": "",
            "forecast": []
        },
        {
            "time": "2022-08-24T17:00:00",
            "lng": 115.6,
            "lat": 20.1,
            "strong": "强热带风暴(STS)",
            "power": 11,
            "speed": 30,
            "move_dir": "西西北",
            "move_speed": 29,
            "pressure": 980,
            "radius7": 240,
            "radius10": 120,
            "radius12": null,
            "radius7_quad": {
                "ne": 240,
                "se": 240,
                "sw": 200,
                "nw": 200
            },
            "radius10_quad": {
                "ne": 100,
                "se": 120,
                "sw": 100,
                "nw": 100
            },
            "radius12_quad": {
                "ne": null,
                "se": null,
                "sw": null,
                "nw": null
            },
            "remark": "",
            "forecast": [
                {
                    "sets": "日本",
                    "points": [
                        {
                            "time": "2022-08-25T17:00:00",
                            "lng": 109.7,
                            "lat": 21.9,
                            "strong": "热带风暴(TS)",
                            "power": 9,
                            "speed": 23,
                            "move_dir": "西西北",
                            "move_speed": 27,
                            "pressure": 992,
                            "radius7": null,
                            "radius10": null,
                            "remark": null
                        }
                    ]
                }
            ]
        },
        {
            "time": "2022-08-24T18:00:00",
            "lng": 115.5,
            "lat": 20.1,
            "strong": "强热带风暴(STS)",
            "power": 11,
            "speed": 30,
            "move_dir": "西西北",
            "move_speed": 29,
            "pressure": 980,
            "radius7": 240,
            "radius10": 120,
            "radius12": 0,
            "radius7_quad": {
                "ne": 240,
                "se": 240,
                "sw": 200,
                "nw": 200
            },
            "radius10_quad": {
                "ne": 100,
                "se": 120,
                "sw": 100,
                "nw": 100
            },
            "radius12_quad": {
                "ne": 0,
                "se": 0,
                "sw": 0,
                "nw": 0
            },
            "remark": "",
            "forecast": [
                {
                    "sets": "中国",
                    "points": [
                        {
                            "time": "2022-08-25T00:00:00",
                            "lng": 114,
                            "lat": 20.6,
                            "strong": "台风(TY)",
                            "power": 12,
                            "speed": 33,
                            "move_dir": null,
                            "move_speed": null,
                            "pressure": 975,
                            "radius7": null,
                            "radius10": null,
                            "remark": null
                        },
                        {
                            "time": "2022-08-25T06:00:00",
                            "lng": 112.2,
                            "lat": 21.22,
                            "strong": "台风(TY)",
                            "power": 12,
                            "speed": 33,
                            "move_dir": null,
                            "move_speed": null,
                            "pressure": 975,
                            "radius7": null,
                            "radius10": null,
                            "remark": null
                        },
                        {
                            "time": "2022-08-25T12:00:00",
                            "lng": 110.37,
                            "lat": 21.88,
                            "strong": "强热带风暴(STS)",
                            "power": 10,
                            "speed": 28,
                            "move_dir": null,
                            "move_speed": null,
                            "pressure": 985,
                            "radius7": null,
                            "radius10": null,
                            "remark": null
                        },
                        {
                            "time": "2022-08-25T18:00:00",
                            "lng": 108.42,
                            "lat": 22.32,
                            "strong": "热带风暴(TS)",
                            "power": 8,
                            "speed": 20,
                            "move_dir": null,
                            "move_speed": null,
                            "pressure": 995,
                            "radius7": null,
                            "radius10": null,
                            "remark": null
                        },
                        {
                            "time": "2022-08-26T06:00:00",
                            "lng": 105.02,
                            "lat": 22.52,
                            "strong": "热带低压(TD)",
                            "power": 7,
                            "speed": 14,
                            "move_dir": null,
                            "move_speed": null,
                            "pressure": 1000,
                            "radius7": null,
                            "radius10": null,
                            "remark": null
                        }
                    ]
                },
                {
                    "sets": "中国香港",
                    "points": [
                        {
                            "time": "2022-08-25T18:00:00",
                            "lng": 110.7,
                            "lat": 21.9,
                            "strong": "台风(TY)",
                            "power": 12,
                            "speed": 33,
                            "move_dir": null,
                            "move_speed": null,
                            "pressure": null,
                            "radius7": null,
                            "radius10": null,
                            "remark": null
                        },
                        {
                            "time": "2022-08-26T18:00:00",
                            "lng": 103.5,
                            "lat": 22.6,
                            "strong": "热带低压(TD)",
                            "power": 7,
                            "speed": 15,
                            "move_dir": null,
                            "move_speed": null,
                            "pressure": null,
                            "radius7": null,
                            "radius10": null,
                            "remark": null
                        },
                        {
                            "time": "2022-08-27T18:00:00",
                            "lng": 97.7,
                            "lat": 24.4,
                            "strong": "",
                            "power": 4,
                            "speed": 7,
                            "move_dir": null,
                            "move_speed": null,
                            "pressure": null,
                            "radius7": null,
                            "radius10": null,
                            "remark": null
                        }
                    ]
                }
            ]
        }
    ]
}]

export class TyphoonEffect{
    private typhoonRoutes:TyphoonRoute[]
    private clampToGround:boolean
    private radius7Color:string
    private radius10Color:string
    private radius12Color:string
    private setsArray:string[] = ['中央台', '日本', '美国', '韩国', '中国香港']
    private viewer:Cesium.Viewer
    private typhoonDatasources :TyphoonDatasource[] = []
    private entityDatasource:Cesium.CustomDataSource
    private interval:Interval
    private iconAngle:number=0
    private typhoonEntity:Cesium.Entity[] = []
    constructor(viewer:Cesium.Viewer,data:any,option:any) {
        this.typhoonRoutes = json
        this.viewer = viewer
        this.clampToGround = option.clampToGround
        this.radius7Color = option.radius7Color
        this.radius10Color = option.radius12Color
        this.radius12Color = option.radius12Color
        this.entityDatasource = new Cesium.CustomDataSource()
        viewer.dataSources.add(this.entityDatasource);
        this.getTyphoonRoute()
        this.addInterVal()
    }

    addInterVal(){
        this.interval = setInterval(() => {
            this.iconAngle += 1.0; // 每次更新旋转1度
            if (this.iconAngle >= 360.0) {
                this.iconAngle = 0.0; // 重置角度
            }
        }, 0.1);
    }

    removeInterVal(){
        clearInterval(this.interval)
    }

    getTyphoonRoute(){
        this.typhoonRoutes.forEach(item => {
            this.addTyphoonRoute(item)
        })
    }

    addTyphoonRoute = (typhoonRoute:TyphoonRoute) => {
        const points: TyphoonPoint[] = []
        const positions: Cesium.Cartesian3[] = []
        const typhoonDatasource: TyphoonDatasource = {
            name: typhoonRoute.tfbh,
            typhoonRoute,
            show: true,
            positions,
            points,
            children: [],
            colors: [],
            type: 'live'
        }
        this.typhoonDatasources.push(typhoonDatasource)
        this.playTyphoonRoute(typhoonRoute.tfbh)
        return typhoonDatasource
    }

    playTyphoonRoute(tfbh: string){
        const typhoonDatasourceIndex = this.typhoonDatasources.findIndex(datasource => datasource.name === tfbh)
        if (typhoonDatasourceIndex >= 0) {
            let index = 0
            const datasource = this.typhoonDatasources[typhoonDatasourceIndex] as TyphoonDatasource
            datasource.points = []
            datasource.positions = []
            const typhoonData = datasource.typhoonRoute
            this.addTyphoonPath(index, datasource)

            cancelAnimationFrame(datasource.playInterval)
            const animation = () => {
                index++
                if (index >= typhoonData.points.length) {
                    cancelAnimationFrame(datasource.playInterval)
                } else {
                    this.addTyphoonPath(index, datasource)
                }

                datasource.playInterval = requestAnimationFrame(animation)
            }
            datasource.playInterval = requestAnimationFrame(animation)
        } else {
            // logger.warn('播放台风失败，原因：未找到对应编号的台风数据。')
            window.$message.warning('播放台风失败，原因：未找到对应编号的台风数据。')
        }
    }

    addTyphoonPath(index: number, datasource: TyphoonDatasource){
        datasource.playIndex = index;
        const point = datasource.typhoonRoute.points[index]
        point.type = 'live'
        point.index = index
        point.tfbh = datasource.name

        datasource.positions.push(Cesium.Cartesian3.fromDegrees(point.lng,point.lat))
    /*        let entity =*/
        datasource.points.push({
            id: point.id || Cesium.createGuid(),
            ...point
        })

        const lastPoint = datasource.points[index]
        let type = point.strong

        lastPoint && datasource.colors.push(colorDict[type as keyof typeof colorDict] || '#409eff')
        // 最后一个实况点，展示预报路径   如最后一个点没有预报路径则显示最新一个点的预报路径
        if (index === datasource.typhoonRoute.points.length - 1) {
            this.showForecast(point, datasource, index)
        }
        this.show(index,datasource)
    }
    showForecast(livePoint: TyphoonPoint, datasource: TyphoonDatasource, index?: number, fromClick = false){
        // 1. 删除预报数据
        datasource.children = []
        // 2. 添加预报
        let forecast = fromClick ? livePoint.forecast || [] : []
        if (!fromClick) {
            for (let i = 0; i < this.setsArray.length; i++) {
                const f = (livePoint:any, index:any) => {
                    const forecastRaw: Array<any> = livePoint?.forecast || []
                    forecast.push(...forecastRaw)

                    if (fromClick) {
                        return
                    }

                    forecast = uniqWith(forecast, (a: any, b) => a.sets === b.sets)

                    const sets = this.setsArray[i]
                    const setsIndex = forecast.findIndex(v => v.sets === sets)

                    if (setsIndex > -1) {
                        if (!forecast[setsIndex].unshifted) {
                            forecast[setsIndex].points.unshift({
                                lat: livePoint.lat,
                                lng: livePoint.lng
                            } as any)
                            forecast[setsIndex].unshifted = true
                        }

                        // continue
                    } else if (index > 0) {
                        const preLivePoint = datasource.typhoonRoute.points[index - 1]
                        f(preLivePoint, index - 1)
                    }
                }

                f(livePoint, index)
            }
        }

        if (!forecast || forecast.length <= 0) {
            return
        }
        // let newForecast = []
        // newForecast = forecast.filter(point => {
        //   return point.sets !== '英国'
        // })
        for (let i = 0; i < forecast.length; i++) {
            // 预报机构数据
            const typhoonRouteBySet = forecast[i]

            const points: TyphoonPoint[] = []
            const positions: Cesium.Cartesian3[] = []
            const datasourceBySet: TyphoonDatasource = {
                name: datasource.name + '_' + typhoonRouteBySet.sets,
                typhoonRoute: typhoonRouteBySet,
                show: true,
                positions,
                points,
                type: 'forc'
            }
            datasource.children.push(datasourceBySet)
            typhoonRouteBySet.points.forEach((point, index) => {
                const position = [point.lng, point.lat]
                datasourceBySet.positions.push(position)

                if (index === 0 && fromClick) {
                    datasourceBySet.positions.unshift([livePoint.lng, livePoint.lat])
                }

                point.sets = typhoonRouteBySet.sets
                point.type = 'forc'
                point.index = index
                index !== 0 && typeof datasourceBySet.points != 'undefined' &&
                datasourceBySet.points.push({
                    id: point.id || Cesium.createGuid(),
                    ...point
                })
            })
        }

    }

    show(index,typhoonDatasource) {
        if (typhoonDatasource.positions.length > 1 && index > 0) {
            this.entityDatasource.entities.add({
                polyline: {
                    positions: [typhoonDatasource.positions[index - 1], typhoonDatasource.positions[index]],
                    width: 3,
                    material: Cesium.Color.fromCssColorString(typhoonDatasource.colors[index])
                }
            })
        }
        if (typhoonDatasource.points) {
            const point = typhoonDatasource.points[typhoonDatasource.playIndex]
            if (typhoonDatasource.type === 'live') {
                if (this.typhoonEntity.length > 0) {
                    for (let i = 0; i < this.typhoonEntity.length; i++) {
                        this.entityDatasource.entities.remove(this.typhoonEntity[i])
                    }
                    this.typhoonEntity = []
                }
                this.typhoonEntity.push(
                    this.entityDatasource.entities.add({
                        position: Cesium.Cartesian3.fromDegrees(point.lng, point.lat),
                        billboard: {
                            image: '/typhoon.png',  // 图标路径
                            scale: 1.0,
                            rotation: new Cesium.CallbackProperty(() => {
                                return Cesium.Math.toRadians(this.iconAngle);
                            }, false),
                            alignedAxis: Cesium.Cartesian3.ZERO // 确保旋转是围绕垂直轴
                        }
                    }),
                )
                if (point?.radius7 > 0) {
                    this.typhoonEntity.push(
                        this.entityDatasource.entities.add({
                            polygon: {
                                hierarchy: Cesium.Cartesian3.fromDegreesArray(this.getTyphoonCirclePositions([point.lng, point.lat], point.radius7_quad)),
                                material: Cesium.Color.fromCssColorString(this.radius7Color)
                            }
                        })
                    )
                }
                if (point?.radius10 > 0) {
                    this.typhoonEntity.push(
                        this.entityDatasource.entities.add({
                            polygon: {
                                hierarchy: Cesium.Cartesian3.fromDegreesArray(this.getTyphoonCirclePositions([point.lng, point.lat], point.radius10_quad)),
                                material: Cesium.Color.fromCssColorString(this.radius10Color)
                            }
                        })
                    )
                }
                if (point?.radius12 > 0) {
                    this.typhoonEntity.push(
                        this.entityDatasource.entities.add({
                            polygon: {
                                hierarchy: Cesium.Cartesian3.fromDegreesArray(this.getTyphoonCirclePositions([point.lng, point.lat], point.radius12_quad)),
                                material: Cesium.Color.fromCssColorString(this.radius12Color)
                            }
                        })
                    )
                }
            }
            this.entityDatasource.entities.add({
                position: Cesium.Cartesian3.fromDegrees(point.lng, point.lat),
                point:{
                    pixelSize:10,
                    color:Cesium.Color.fromCssColorString(typhoonDatasource.colors[index])
                }
            })
        }
        if (typhoonDatasource.children.length > 0){
           let childrenDatasources = typhoonDatasource.children
            childrenDatasources.forEach((childrenDatasource)=>{
                let positions = [typhoonDatasource.points[index].lng,typhoonDatasource.points[index].lat]
                for(let i = 0 ; i < childrenDatasource.points.length ; i++){
                    let point = childrenDatasource.points[i]
                    this.entityDatasource.entities.add({
                        position: Cesium.Cartesian3.fromDegrees(point.lng, point.lat),
                        point:{
                            pixelSize:10,
                            color:Cesium.Color.fromCssColorString(colorDict[point.strong as keyof typeof colorDict] || '#409eff')
                        }
                    })
                    positions.push(point.lng,point.lat)
                }
                let color = "#FFFFFF"
                try{
                    console.log(childrenDatasource.typhoonRoute.sets)
                    let colorReset = forcColorDict[childrenDatasource.typhoonRoute.sets]
                    if(colorReset){
                        color = colorReset
                    }
                }catch (e){
                }
                console.log(color)
                if(positions.length > 2) {
                    this.entityDatasource.entities.add({
                        polyline: {
                            positions: Cesium.Cartesian3.fromDegreesArray(positions),
                            material:new Cesium.PolylineDashMaterialProperty({
                                color:Cesium.Color.fromCssColorString(color),
                            }),
                            width: 3,
                        }
                    })
                }
            })
        }
    }

    getTyphoonCirclePositions(center, radiusData){
        let positions = []
        if (radiusData['ne']) {
            const _angInterval = 6
            const _pointNums = 360 / (_angInterval * 4)
            const quadrant = {
                // 逆时针算角度
                '0': 'ne',
                '1': 'nw',
                '2': 'sw',
                '3': 'se'
            }
            for (let i = 0; i < 4; i++) {
                let _r = parseFloat(radiusData[quadrant[i]]) * 1000 // 单位是km
                if (!_r) _r = 0
                for (let j = i * _pointNums; j <= (i + 1) * _pointNums; j++) {
                    const _ang = _angInterval * j
                    const x: number = center[0] + (_r * Math.cos((_ang * Math.PI) / 180)) / 111000
                    const y: number = center[1] + (_r * Math.sin((_ang * Math.PI) / 180)) / 111000
                    positions.push(x, y)
                }
            }
        }
        return positions
    }


}

