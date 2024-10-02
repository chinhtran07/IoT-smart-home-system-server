import DeviceCondition from "../models/deviceCondition.model.js";
import TimeCondition from "../models/timeCondition.model.js";

class ConditionFactory {
  static createCondition(type, conditionData) {
    switch (type) {
      case "device":
        return new DeviceCondition(conditionData);
      case "time":
        return new TimeCondition(conditionData);
      default:
        throw new Error(`Condition type "${type}" is not supported.`);
    }
  }
}

export default ConditionFactory;
