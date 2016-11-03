export class Test {

    static count: number = 0;

    static pass( msg ) {
        this.count ++;
        console.info( 'PASS ' + this.count + ' : ' + msg );
    }
    static fail( msg ) {
        this.count ++;
        console.error( 'FAIL ' + this.count + ' : ' + msg );
    }
}