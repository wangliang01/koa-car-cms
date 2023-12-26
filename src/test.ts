class A {
  public nameA: string;
  constructor() {
    this.nameA = 'nameA'
  }
  validateA() {
    console.log('validateA')
  }
}

class B extends A {
  public nameB: string;
  constructor() {
    super()
    this.nameB = 'nameB'
  }
  validateB() {
    console.log('validateB')
  }
}

class C extends B {
  public nameC: string;
  constructor() {
    super()
    this.nameC = 'nameC'
  }
  validateC() {
    console.log('validateC')
  }
}



function findMembers(className: object, propName: string, funcPrefix: string) {
  let ret: string[] = []
  const _find = (obj: object) => {
    if (obj === null) return 
    const keys = Object.getOwnPropertyNames(obj)
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i]
      if (key.indexOf(propName) > -1 && isValidKey(key, obj)) {
        ret.push(obj[key])
        continue
      }
      if (key.indexOf(funcPrefix) > -1 && isValidKey(key, obj)) {
        
        ret.push(key)
        continue
      }
    }
   
    
    const proto = Object.getPrototypeOf(obj)
    
    _find(proto)
  }
  
  _find(className)
  
  return ret

}

const c = new C()

const members = findMembers(c, 'name', 'validate')
console.log(members)


function isValidKey (key: string | number | symbol, object: object): key is keyof typeof object {
  return key in object
}