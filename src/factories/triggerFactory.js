import DeviceTrigger from "../models/deviceTrigger.model.js"; 
import TimeTrigger from "../models/timeTrigger.model.js"; 

class TriggerFactory {
    static createTrigger(type, triggerData) {
        switch (type) {
            case "device":
                return new DeviceTrigger(triggerData);
            case "time":
                return new TimeTrigger(triggerData);
            default:
                throw new Error(`Trigger type "${type}" is not supported.`);
        }
    }
}

export default TriggerFactory;
