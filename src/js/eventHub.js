window.eventHub={
  events:{
    
  },
  /*publish(eventName,fn){
    if(this.events[eventName]===undefined){
      this.events[eventName] = [];
    }
    this.events[eventName].push(fn.call());
    console.log(`${eventName}`) ;
    console.log(this.events[eventName]);
  },
  watch(eventName,fn){
    for(let key in this.events){
      if (key === eventName){
        $(this.events[eventName]).on('change',function(){
          console.log(1);
          fn && fn.call();
        })
      }
    }
  },*/
  emit(eventName,data){ //publish
    for(let key in this.events){
      if(key === eventName){
        let fnList = this.events[key];
        fnList.map((fn)=>{
          fn.call(undefined,data);
        })
      }
    }
  },
  on(eventName,fn){ //subscribe
    if (this.events[eventName]===undefined){
      this.events[eventName] = [];
    }
      this.events[eventName].push(fn);
  }
}