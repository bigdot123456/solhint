const assert = require('assert')
const linter = require('./../lib/index')
const { contractWith, funcWith } = require('./common/contract-builder')
const { noIndent } = require('./common/configs')

describe('Linter', () => {
  describe('Quote Rules', () => {
    it('should raise quotes error', () => {
      const code = contractWith("string private a = 'test';")

      const report = linter.processStr(code, noIndent())

      assert.equal(report.errorCount, 1)
      assert.ok(report.messages[0].message.includes('double quotes'))
    })

    it('should raise quotes error in import', () => {
      const code = "import * from 'lib.sol';"

      const report = linter.processStr(code)

      assert.equal(report.errorCount, 1)
      assert.ok(report.messages[0].message.includes('double quotes'))
    })

    it('should raise quotes error in import for custom rules', () => {
      const code = 'import * from "lib.sol";'

      const report = linter.processStr(code, { rules: { quotes: ['error', 'single'] } })

      assert.equal(report.errorCount, 1)
      assert.ok(report.messages[0].message.includes('single quotes'))
    })

    it('should raise quotes error in import for custom rules', () => {
      const code = 'import * from "lib.sol";'

      const report = linter.processStr(code, { rules: { quotes: ['error', 'single'] } })

      assert.equal(report.errorCount, 1)
      assert.ok(report.messages[0].message.includes('single quotes'))
    })

    it('should raise quotes error in import for complex import', () => {
      const code = "import {a as b, c as d} from 'lib.sol';"

      const report = linter.processStr(code)

      assert.equal(report.errorCount, 1)
      assert.ok(report.messages[0].message.includes('double quotes'))
    })

    const ERROR_ASSEMBLY_CLAUSES = [
      "assembly { 'abc' }",
      "assembly { dataSize('uint') }",
      "assembly { linkerSymbol('uint') }"
    ]

    ERROR_ASSEMBLY_CLAUSES.forEach(curText =>
      it(`should raise quotes error in assembly clause ${curText}`, () => {
        const code = funcWith(curText)

        const report = linter.processStr(code, noIndent())

        assert.equal(report.errorCount, 1)
        assert.ok(report.messages[0].message.includes('double quotes'))
      })
    )
  })
})
