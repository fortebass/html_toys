var loader = {
    loaded:true,
    loadedCount:0, // Assets that have been loaded so far
    totalCount:0, // Total number of assets that need to be loaded
    loadImage:function(url){
        loader.loaded = false;
        var image = new Image();
        image.src = url;
        image.onload = loader.itemLoaded;
        return image;
    },
    itemLoaded:function(){
        loader.loadedCount++;
        loader.loaded = true;
    }
};

