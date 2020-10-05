import * as React from 'react'
export default function HomeScene() {
  const [input, setInput] = React.useState('')
  const [includedUsers, setIncludedUsers] = React.useState(new Set())
  const [unquotedUsers, setUnquotedUsers] = React.useState(new Set())

  const output = input
    .split(/\n(?=.*(?:[AP]M|\d\d\/\d\d\/2020)\n)/g)
    .map((i) => (console.log(i), i))
    .filter(Boolean)
    .map((message) => {
      const [heading, ...lines] = message.trim().split('\n')

      const [author] = heading.includes('Today')
        ? heading.split('Today')
        : heading.includes('Yesterday')
        ? heading.split('Yesterday')
        : heading.split(/\d\d\/\d\d\/2020/)

      return {
        author,
        lines,
      }
    })
    .filter((message) => message.author)

  const authors = Array.from(
    output.reduce((authors, message) => {
      return authors.add(message.author)
    }, new Set())
  )

  return (
    <div className="flex flex-col p-3 column">
      <div className="align-self-stretch">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="w-full border rounded"
        />
      </div>
      <div>
        <strong> Include these users </strong>
        {authors.map((author) => {
          return (
            <div key={author}>
              <input
                type="checkbox"
                id={`include-user-${author}`}
                checked={includedUsers.has(author)}
                onChange={() =>
                  setIncludedUsers((includedUsers) => {
                    if (includedUsers.has(author)) {
                      includedUsers.delete(author)
                    } else {
                      includedUsers.add(author)
                    }

                    return new Set(includedUsers)
                  })
                }
              />
              <label htmlFor={`include-user-${author}`}> {author} </label>
            </div>
          )
        })}
      </div>
      <br />
      <div>
        <strong> Unquote these users </strong>
        {authors
          .filter((author) => includedUsers.has(author))
          .map((author) => {
            return (
              <div key={author}>
                <input
                  type="checkbox"
                  id={`unquote-user-${author}`}
                  checked={unquotedUsers.has(author)}
                  onChange={() =>
                    setUnquotedUsers((unquotedUsers) => {
                      if (unquotedUsers.has(author)) {
                        unquotedUsers.delete(author)
                      } else {
                        unquotedUsers.add(author)
                      }

                      return new Set(unquotedUsers)
                    })
                  }
                />
                <label htmlFor={`unquote-user-${author}`}> {author} </label>
              </div>
            )
          })}
      </div>
      <br />
      <strong> Transcript </strong>
      <div className="align-self-stretch">
        <pre className="whitespace-pre-wrap">
          {output
            .filter((message) => includedUsers.has(message.author))
            .map((message) => {
              return (
                <div key={message.lines} className="pb-3">
                  {unquotedUsers.has(message.author) ? '' : message.author}
                  <br />
                  <div>
                    {message.lines.map((line) => (
                      <div key={line}>
                        {unquotedUsers.has(message.author) ? '' : '> '}
                        {line}
                      </div>
                    ))}
                  </div>
                </div>
              )
            })}
        </pre>
      </div>
    </div>
  )
}
