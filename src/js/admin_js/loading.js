{
  let view = {
    el:'div.loading-wrapper',
    template:`
    <div class="loading-wrapper">
      <div class="loading">
          <span></span>
          <span></span>
          <span></span>
      </div>
    </div> 
    `,
    render(){
      let el = this.el;
      let wrapper = document.querySelector(el);
      console.log(wrapper)
      if(wrapper){
        let toR = $('body > div.loading-wrapper')
        console.log(toR)
        toR.remove();
      }else{
        console.log('to render')
        $('body').append(this.template);
        console.log('appended')
        //let loading = $('document div:last-child')[0];
      }
    },
    activate(){
      $(this.el).addClass('active');
    },
    deactivate(){
      $(this.el).removeClass('active');
    }
  };
  let model = {};
  let controller = {
    init(view,model){
      this.view = view;
      this.model = model;
      window.eventHub.on('beforeUpload',(data)=>{
        this.view.render();
        console.log('rendered');
        this.view.activate();
        console.log('activated')
      });
      window.eventHub.on('new',(data)=>{
        this.view.deactivate();
        console.log('deactivated');
        this.view.render();
        console.log('rendered')
      })
    }
  };
  controller.init(view,model)
}