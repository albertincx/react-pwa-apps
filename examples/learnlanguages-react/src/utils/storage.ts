class Storage {
    _(k: string, def = false) {
        return localStorage.getItem(k) || def;
    }

    rm(k: string) {
        return localStorage.removeItem(k);
    }

    get(k: string, def: any = "") {
        return localStorage.getItem(k) || def;
    }

    set(k: string, v: any) {
        localStorage.setItem(k, v);
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

    setJ(k: string, v: any) {
        return this.set(k, JSON.stringify(v));
    }
}

export default new Storage();
