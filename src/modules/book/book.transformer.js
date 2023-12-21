class BookStoreTransformer{
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
        data.quantity = Number(data.quantity)
        
        if(this._files){
            let images = [];
            this._files.map((item) => {
                images.push(item.filename);
            })
            data.images = images
        }
        
       
        return data;
    }
    
}

module.exports = BookStoreTransformer;