from collections import deque

INTERVALS = {
    '10sec':           10 * 1000,
    '1min' :       1 * 60 * 1000,
    '10min':      10 * 60 * 1000,
    '1h'   :  1 * 60 * 60 * 1000,
    '6h'   :  6 * 60 * 60 * 1000,
    '24h'  : 24 * 60 * 60 * 1000
}
INTERVAL_KEYS = INTERVALS.keys()

class Datadump():
    def __init__(self):
        self.datadump = {}

    def insert(self, device_id, data, current_time):
        if device_id not in self.datadump:
            self.datadump[device_id] = {}
            for key in INTERVAL_KEYS:
                self.datadump[device_id][key] = deque()
        
        for key in INTERVAL_KEYS:
            q = self.datadump[device_id][key]
            q.append(data)
            while len(q) > 0 and q[0]['timestamp'] + INTERVALS[key] < current_time:
                q.popleft()
    
    def get(self, device_id, recent):
        if device_id not in self.datadump:
            raise KeyError('device_id')
        if recent not in self.datadump[device_id]:
            raise KeyError('recent')
        return list(self.datadump[device_id][recent])
