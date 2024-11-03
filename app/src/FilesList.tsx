function FilesList({files}) {
  return (
    <div className="flex justify-between">
      <>
        <h2>Offers:</h2>
        {files && Array.isArray(files.offers) && files.offers.length > 0 ? (
          <ul>
            {files.offers.map((file, index) => (
              <li key={index}>{file}</li>
            ))}
          </ul>
        ) : (
          <p>No files available.</p>
        )}
        <>
          <h2>Screenshots:</h2>
          {files &&
          Array.isArray(files.screenshots) &&
          files.screenshots.length > 0 ? (
            <ul>
              {files.screenshots.map((file, index) => (
                <li key={index}>
                  <a
                    href={`output/screenshots/${file}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {file}
                  </a>
                </li>
              ))}
            </ul>
          ) : (
            <p>No files available.</p>
          )}
        </>
      </>
    </div>
  );
}

export default FilesList;
