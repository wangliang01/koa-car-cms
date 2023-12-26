import { Success } from './../core/http-exception';
import Phone from '../model/user/phone';
import { ISMSCode } from './../types/index';
class UserService {
  static async dispatchSMSCode({mobile, clientIp, curDate}: ISMSCode) {
    let smsSendMax = 6 // 设定每个手机号短信发送限制数
    let ipCountMax = 10 // 设定ip数限制数
    let smsCode = '' // 随机短信验证码
    let smsCodeLen = 4 // 随机短信验证码长度

    smsCode = genSMSCode(smsCodeLen)
    console.log('短信验证码', smsCode)
    // 根据当前日期、手机号查到该手机号当天的发送次数
    const count =  await Phone.findSMSCount(mobile, curDate, smsCode, smsSendMax)
    console.log(count)
    // 同一天，同一个 ip 文档条数
    // const clientIpCount = await Phone.findClientIpCount(clientIp, curDate, ipCountMax)
    
    throw new Success({smsCode})
  }
}

/**
 * 
 * 发送短信验证码
 * @returns 2456
 */
function genSMSCode(smsCodeLen: number) {
  let smsCode = ''
  for (let i = 0; i < smsCodeLen; i++) {
    smsCode += Math.floor(Math.random() * 10);
  }
  return smsCode
}

export default UserService