class BannerStoreTransformer{
    _data;
    _files;
    constructor (req) {
        this._data = req.body;
        this._files= req.files;
    }

    transformData =() => {
        let data ={
            ...this._data
        };
        
        if(this._files){
            let image = {};
            this._files.map((item) => {
                data.image = item.filename

            })
        }
        
       
        return data;
    }
    
}

module.exports = BannerStoreTransformer;