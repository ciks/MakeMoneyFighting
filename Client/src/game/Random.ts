class Random {
    public static RandF(min: number, max: number): number {
        return Math.random() * (max - min) + min;
    }
    public static RandI(min: number, max: number): number {
        return Math.ceil(Random.RandF(min, max));
    }
}