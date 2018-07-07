const React = require('react')
const { BrowserWindow } = require('electron').remote

module.exports = class settings extends React.PureComponent {
    constructor(props){
        super(props)
    }
    getUserId(){
        let image = document.querySelector('.container-2Thooq > .wrapper-2F3Zv8 > .avatar-small')
        if(!image) return

        let style = image.getAttribute('style')
        if(!style) return

        // This can happen?
        let id = style.toString().match(/avatars\/(.*)\//)
        if(!id) return

        // Get and return ID
        return id[1]
    }
    loadUDB(){
        let win = new BrowserWindow({width: 800, height: 700,frame: false,transparent:false})
        win.loadURL(`https://udb.glitch.me/upload`)
        win.once('ready-to-show', () => {
          win.show()
          win.setClosable(false)
        })
        win.webContents.on('did-get-redirect-request', (event,oldURL,newURL) =>{
          if(newURL === "https://udb.glitch.me/success" || newURL === "https://udb.glitch.me" || newURL === "https://udb.glitch.me/"){
            win.close()
            if(this.id) this.props.plugin.getUser(this.id)
          }
        })
        win.webContents.on('did-navigate',(event,url) => {
          if(url === "https://udb.glitch.me/success" || url === "https://udb.glitch.me" || url === "https://udb.glitch.me/"){
            win.close()
            if(this.id) this.props.plugin.getUser(this.id)
          }
        })
        win.webContents.on('did-navigate-in-page',(event,url) => {
          if(url === "https://udb.glitch.me/success" || url === "https://udb.glitch.me" || url === "https://udb.glitch.me/"){
            win.close()
            if(this.id) this.props.plugin.getUser(this.id)
          }
        })
    }
    render() {
        let id = this.getUserId()
        this.id = id
        if(id) this.props.plugin.getUser(id)
        return (
            <div>
                <div className="udbButton" onClick={this.loadUDB.bind(this)} id={"udbUser"+id} style={ {'width':'300px','height':'200px','backgroundSize':'cover','backgroundPosition':'center','backgroundRepeat':'no-repeat','backgroundColor':'black','cursor':'pointer'} } ></div>
            </div>
        )
    }
}