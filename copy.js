/**WeakMap 对象是一组键/值对的集合，其中的键是弱引用的。其键必须是对象，而值可以是任意的。
 * 在计算机程序设计中，弱引用与强引用相对，是指不能确保其引用的对象不会被垃圾回收器回收的引用。 一个对象若只被弱引用所引用，则被认为是不可访问（或弱可访问）的，并因此可能在任何时刻被回*/
function clone (target,map = new WeakMap()) {
    //为对象时进行拷贝,克隆原始类型
    if(!isObject(target)){
        return target
    }
     // 初始化
    const type = getType(target);
    let cloneTarget;
    if (deepTag.includes(type)) {
        cloneTarget = getInit(target, type);
    }
    // const isArray = Array.isArray(target);
    // let cloneTarget = isArray ? [] : {};//考虑数组情况

    //防止循环引用
    if(map.get(target)){
        return map.get(target)
    }
    map.set(target,cloneTarget)

     // 克隆set
     if (type === setTag) {
        target.forEach(value => {
            cloneTarget.add(clone(value,map));
        });
        return cloneTarget;
    }

    // 克隆map
    if (type === mapTag) {
        target.forEach((value, key) => {
            cloneTarget.set(key, clone(value,map));
        });
        return cloneTarget;
    }

    // 克隆对象和数组
    const keys = type === arrayTag ? undefined : Object.keys(target);
    forEach(keys || target, (value, key) => {
        if (keys) {
            key = value;
        }
        cloneTarget[key] = clone(target[key], map);
    });

    return cloneTarget;
    
}
function cloneOtherType(targe, type) {
    const Ctor = targe.constructor;
    switch (type) {
        case boolTag:
        case numberTag:
        case stringTag:
        case errorTag:
        case dateTag:
            return new Ctor(targe);
        case regexpTag:
            return cloneReg(targe);
        case symbolTag:
            return cloneSymbol(targe);
        default:
            return null;
    }
}
function cloneSymbol(targe) {
    return Object(Symbol.prototype.valueOf.call(targe));
}
function cloneReg(targe) {
    const reFlags = /\w*$/;
    const result = new targe.constructor(targe.source, reFlags.exec(targe));
    result.lastIndex = targe.lastIndex;
    return result;
}



function forEach(array, iteratee) {
    let index = -1;
    const length = array.length;
    while (++index < length) {
        iteratee(array[index], index);
    }
    return array;
}
function isObject(target) {
    const type = typeof target;
    return target !==null && (type === 'object' || type === 'function')

}
function getType(target) {
    return Object.prototype.toString.call(target);
}
function getInit(target) {
    const Ctor = target.constructor;
    return new Ctor();
}
const mapTag = '[object Map]';
const setTag = '[object Set]';
const arrayTag = '[object Array]';
const objectTag = '[object Object]';

const boolTag = '[object Boolean]';
const dateTag = '[object Date]';
const errorTag = '[object Error]';
const numberTag = '[object Number]';
const regexpTag = '[object RegExp]';
const stringTag = '[object String]';
const symbolTag = '[object Symbol]';


const target = {
    field1: 1,
    field2: undefined,
    field3: 'ConardLi',
    field4: {
        child: [1,2,3],
        child2: {
            child2: 'child2'
        }
    }
};
console.time("计算耗时");
target.target = target
console.log(clone(target))
console.timeEnd("计算耗时");//计算中间代码执行时间 会打出default: **ms   "计算耗时":ms