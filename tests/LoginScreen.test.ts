import { LoginScreenModel } from "../src/screens/LoginScreen/LoginScreenModel";
import { LoginScreenController } from "../src/screens/LoginScreen/LoginScreenController";

describe("LoginScreenModel Class",() => {
    test('initializes with empty username and password',()=>{
        const model = new LoginScreenModel()
        expect(model.username).toBe('')
        expect(model.password).toBe('')
    })
    test('can set the username and password',()=>{
        const model=new LoginScreenModel()
        model.username='testuser'
        model.password='testpassword'

        expect(model.username).toBe('testuser')
        expect(model.password).toBe('testpassword')
    })
})

describe('LoginScreenController Class',()=>{
    let mockScreenSwitcher:any

    beforeEach(()=>{
        mockScreenSwitcher={
            switchToScreen :jest.fn()

        }
        globalThis.fetch=jest.fn()
    })
    test('initialize with a view',()=>{
        const controller=new LoginScreenController(mockScreenSwitcher)
        expect(controller.getView()).toBeDefined()
    })
    test('successful login switches to tower select screen',async()=>{
        (globalThis.fetch as jest.Mock).mockResolvedValueOnce({
            ok:true,
            json:async()=>({
                username:'testuser',
                highestTowerUnlocked:3
            })
        })
        const controller=new LoginScreenController(mockScreenSwitcher)
        const view =controller.getView()
        await(view as any).onLogin('testuser','password123')

        expect(mockScreenSwitcher.switchToScreen).toHaveBeenCalledWith({
            type:'tower_select'
        })
    })
    test('failed login does not switch screen',async()=>{
        (globalThis.fetch as jest.Mock).mockResolvedValueOnce({
            ok:false,
            json:async()=>({error:'Invalid credentials'})
        })
        const controller=new LoginScreenController(mockScreenSwitcher)
        const view =controller.getView()
        await(view as any).onLogin('testuser','incorrectpass')

        expect(mockScreenSwitcher.switchToScreen).not.toHaveBeenCalled()
    })
    test('empty username or password prevents login',async()=>{
        const controller=new LoginScreenController(mockScreenSwitcher)
        const view=controller.getView()

        await(view as any).onLogin('','password')

        expect(globalThis.fetch).not.toHaveBeenCalled()
        expect(mockScreenSwitcher.switchToScreen).not.toHaveBeenCalled()
    })
    test('successful signup switches to tower select screen',async()=>{
        (globalThis.fetch as jest.Mock).mockResolvedValueOnce({
            ok:true,
            json:async()=>({
                username:'newuser',
                highestTowerUnlocked:1
            })
        })
        const controller=new LoginScreenController(mockScreenSwitcher)
        const view=controller.getView()
        await(view as any).onSignUp('newuser','newpassword123')
        expect(mockScreenSwitcher.switchToScreen).toHaveBeenCalledWith({
            type:'tower_select'
            })
        })
        test('network error during login is handled',async()=>{
            (globalThis.fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'))
            const controller = new LoginScreenController(mockScreenSwitcher)
            const view=controller.getView()

            await(view as any).onLogin('testuser','testuserpass')

            expect(mockScreenSwitcher.switchToScreen).not.toHaveBeenCalled()
        })
})

