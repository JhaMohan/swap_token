const EthSwap = artifacts.require('EthSwap')
const Token = artifacts.require('Token')

require('chai')
 .use(require('chai-as-promised'))
 .should()




contract('EthSwap',(accounts)=>{

    let token,ethSwap,balance

    before(async ()=>{
        token = await Token.new()
        ethSwap = await EthSwap.new()
        balance = await token.totalSupply()
        await token.transfer(ethSwap.address,balance)
    })



    describe('Tokencontract  deployed',async ()=>{
   
        it('contract has a name', async () =>{   
           const name = await token.name() 
           assert.equal(name,'TezTara Token')
        })
   })


    describe('EthSwap contract  deployed',async ()=>{
   

         it('contract has a name', async () =>{
            const name = await ethSwap.name()
            assert.equal(name,'Wleome to the Exchange portal')
         })


         it('smartcontract has balance', async ()=>{
            const ethSwapbalance = await token.balanceOf(ethSwap.address)
            assert.equal(ethSwapbalance.toString(),balance.toString())
         })

    })


})