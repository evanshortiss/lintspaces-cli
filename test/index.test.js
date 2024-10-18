const cli = require('../index')
const { expect } = require('expect')
const sinon = require('sinon')
const path = require('path')

describe('lintspaces-cli', () => {
  it('should find tabs, but expect spaces', () => {
    const filepath = path.join(__dirname, 'samples/malformed.tabs.js')
    const processStub = {
      argv: [
        '/usr/local/bin/node',
        path.join(__dirname, '../bin/lintspaces-cli.js'),
        '-d',
        'spaces',
        '-s',
        '2',
        filepath,
        '--json'
      ],
      exit: sinon.stub()
    }

    const consoleStub = {
      log: sinon.stub(),
      warn: sinon.stub()
    }

    const expectedResult = JSON.stringify({
      [filepath]: {
        "2": [
          {
            "line": 2,
            "code": "INDENTATION_SPACES",
            "type": "warning",
            "message": "Unexpected tabs found."
          }
        ],
        "6": [
          {
            "line": 6,
            "code": "INDENTATION_SPACES",
            "type": "warning",
            "message": "Unexpected tabs found."
          }
        ]
      }
    })

    cli(processStub, consoleStub)

    expect(consoleStub.log.calledOnce).toBeTruthy()
    expect(consoleStub.log.getCall(0).args[0]).toEqual(expectedResult)
  })

  it('should find excessive newlines', () => {
    const filepath = path.join(__dirname, 'samples/malformed.newlines.js')
    const processStub = {
      argv: [
        '/usr/local/bin/node',
        path.join(__dirname, '../bin/lintspaces-cli.js'),
        '-d',
        'spaces',
        '-s',
        '2',
        '--maxnewlines=2',
        filepath
      ],
      exit: sinon.stub()
    }

    const consoleStub = {
      log: sinon.stub(),
      warn: sinon.stub()
    }

    cli(processStub, consoleStub)

    expect(consoleStub.warn.called).toBeTruthy()

    const output = consoleStub.warn.getCalls().map(c => c.args).join('\n')

    expect(output).toContain('Line: 6 Maximum amount of newlines exceeded.')
    expect(output).toContain(`File: ${filepath}`)
  })
})
