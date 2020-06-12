const { default: Web3 } = require('web3');
const { assert } = require('chai');

const EthSwap = artifacts.require('EthSwap')
const Token = artifacts.require('Token')

require('chai')
 .use(require('chai-as-promised'))
 .should()


function tokens(n){
   return web3.utils.toWei(n,'ether');
}

contract('EthSwap',([deployer,investor])=>{

    let token,ethSwap

    before(async ()=>{
        token = await Token.new()
        ethSwap = await EthSwap.new(token.address)
        await token.transfer(ethSwap.address,tokens('1000000'))
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
            assert.equal(name,'Welcome to the Exchange portal')
         })


         it('smartcontract has balance', async ()=>{
            const ethSwapbalance = await token.balanceOf(ethSwap.address)
            assert.equal(ethSwapbalance.toString(),tokens('1000000'))
         })

    })

    describe('buytoken()', async ()=>{
       let result;
       before(async ()=>{
         result = await ethSwap.buyTokens({from:investor,value: web3.utils.toWei('1','ether')})
       })

       it('user can buy token instantently',async ()=>{

            //Investor balance after purchase
            const balance = await token.balanceOf(investor);
            assert.equal(balance.toString(),(web3.utils.toWei('1','ether')*100).toString())


            //check ethSwap balance after purchase
            const ethSwapBalance = await token.balanceOf(ethSwap.address);
            assert.equal(ethSwapBalance.toString(),tokens('999900'))
            const ethSwapEtheBalance = await web3.eth.getBalance(ethSwap.address)
            assert.equal(ethSwapEtheBalance.toString(),web3.utils.toWei('1','ether'))

            const event = result.logs[0].args

            assert.equal(event.account,investor);
            assert.equal(event.token,token.address)
            assert.equal(event.amount.toString(),tokens('100').toString())
            assert.equal(event.rate.toString(),'100')

       })

    })



    describe('sellToken()', async ()=>{
      let result;
      before(async ()=>{
      
         await token.approve(ethSwap.address,tokens('100'),{from:investor})
         result = await ethSwap.sellTokens(tokens('100'),{from:investor})
      })

      it('sell the token back to ethSwap', async()=>{
         const balance = await token.balanceOf(investor);
         assert.equal(balance.toString(),tokens('0').toString())

      
     
         //check ethSwap balance after sell
         const ethSwapBalance = await token.balanceOf(ethSwap.address);
         assert.equal(ethSwapBalance.toString(),tokens('1000000'))
         const ethSwapEtheBalance = await web3.eth.getBalance(ethSwap.address)
         assert.equal(ethSwapEtheBalance.toString(),web3.utils.toWei('0','ether'))



         const event = result.logs[0].args

         assert.equal(event.account,investor);
         assert.equal(event.token,token.address)
         assert.equal(event.amount.toString(),tokens('100').toString())
         assert.equal(event.rate.toString(),'100')

         await ethSwap.sellTokens('500',{from:investor}).should.be.rejected;

      })






    })


})