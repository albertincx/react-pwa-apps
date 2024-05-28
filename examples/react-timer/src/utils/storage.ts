class Storage {
    _(k: string, def = false) {
        return localStorage.getItem(k) || def;
    }

    rm(k: string) {
        return localStorage.removeItem(k);
    }

    get(k: string, def: string = "") {
        return localStorage.getItem(k) || def;
    }

    set(k: string, v: string | number) {
        localStorage.setItem(k, `${v}`);
    }

    getJ(k: string) {
        const v = this.get(k);
        if (v) {
            try {
                return JSON.parse(v);
            } catch (e) {
                //
            }
        }
        return false;
    }

    setJ(k: string, v) {
        return this.set(k, JSON.stringify(v));
    }
}

export const StorageManager =  new Storage();
