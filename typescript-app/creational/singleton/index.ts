// ----------------
// SingletonPattern
// インスタンスが1つしか生成されないことを保証できる。
// ----------------
class SingletonSample
{
    private id: string = Math.random().toString(32).substring(2);
    private static instance: SingletonSample = new SingletonSample();

    private constructor() {}

    public static getInstance(): SingletonSample {
        return this.instance;
    }

    public getId(): string {
        return this.id;
    }
}

// yarn ts-node /singleton/index.ts
const i1 = SingletonSample.getInstance();
const i2 = SingletonSample.getInstance();
console.log(i1, i2, i1 === i2);

